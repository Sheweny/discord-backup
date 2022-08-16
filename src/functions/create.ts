import { Guild, GuildMember, OverwriteType } from 'discord.js';
import { ChannelType, SnowflakeUtil } from 'discord.js';
import { Types } from 'mongoose';
import GuildBackup from '../models/guild';

export async function create(guild: Guild, backupOwner: GuildMember) {
	const bans = await fetchBans(guild);
	const categories = await fetchCategories(guild);
	const channels = await fetchChannels(guild);
	const emojis = await fetchEmojis(guild);
	const roles = await fetchRoles(guild);

	const backupId = SnowflakeUtil.generate({ timestamp: Date.now() });
	const merged = Object.assign({
		_id: new Types.ObjectId(),
		backupId: backupId,
		createdAt: Date.now(),
		backupOwner: backupOwner.id,
		guildId: guild.id,
		guildName: guild.name,
		guildDescription: guild.description,
		guildIcon: guild.iconURL(),
		guildBans: bans,
		guildCategories: categories,
		guildChannels: channels,
		guildEmojis: emojis,
		guildRoles: roles,
	});
	const backupModel = new GuildBackup(merged);
	await backupModel.save();
	return backupId;
}

async function fetchBans(guild: Guild) {
	const bansFetch = await guild.bans.fetch();
	const bans: string[] = bansFetch.map(b => b.user.id);
	return bans;
}

async function fetchCategories(guild: Guild) {
	const channelsFetch = await guild.channels.fetch();
	const categoriesFilter = channelsFetch.filter(
		c => c.type === ChannelType.GuildCategory,
	);

	const categories = categoriesFilter.map(cat => ({
		name: cat.name,
		rawPosition: cat.rawPosition,
		permissionOverwrites: cat.permissionOverwrites.cache.map(p => {
			({
				id: p.id,
				type: p.type,
				deny: p.deny.bitfield.toString(),
				allow: p.allow.bitfield.toString(),
			});
		}),
	}));
	return categories;
}

async function fetchChannels(guild: Guild) {
	const channelsFetch = await guild.channels.fetch();
	const channelsFilter = channelsFetch.filter(
		c => c.type !== ChannelType.GuildCategory,
	);

	const channels = channelsFilter
		.filter(channel => {
			if (!channel.deletable) return false;
			return true;
		})
		.map(channel => {
			return {
				name: channel.name,
				type: channel.type,
				rawPosition: channel.rawPosition,
				parent: channel.parent?.name,
				topic:
					channel.type === ChannelType.GuildText
						? channel.topic
						: undefined,
				nsfw:
					channel.type === ChannelType.GuildText
						? channel.nsfw
						: undefined,
				slowMode:
					channel.type === ChannelType.GuildText
						? channel.rateLimitPerUser
						: undefined,
				slots:
					channel.type === ChannelType.GuildVoice ||
					channel.type === ChannelType.GuildStageVoice
						? channel.userLimit
						: undefined,
				permissionOverwrites: channel.permissionOverwrites.cache.map(
					p => ({
						id: p.id,
						type: p.type,
						deny: p.deny.bitfield.toString(),
						allow: p.allow.bitfield.toString(),
					}),
				),
			};
		});
	return channels;
}

async function fetchEmojis(guild: Guild) {
	const emojisFetch = await guild.emojis.fetch();
	const emojis = emojisFetch.map(emoji => ({
		name: emoji.name,
		animated: emoji.animated,
		id: emoji.id,
	}));
	return emojis;
}

async function fetchRoles(guild: Guild) {
	const rolesFetch = await guild.roles.fetch();
	const roles = rolesFetch
		.filter(role => role.id !== guild.id)
		.filter(role => role.tags?.botId === undefined)
		.map(role => ({
			name: role.name,
			color: role.color,
			rawPosition: role.rawPosition,
			permissions: role.permissions.bitfield.toString(),
		}));
	return roles;
}
