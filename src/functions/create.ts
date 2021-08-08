import { Guild, SnowflakeUtil } from "discord.js";
import { GuildDB } from '../models/index';
import { Types } from 'mongoose';

export async function create(guild: Guild) {
	const bans = await fetchBans(guild)
	const categories = await fetchCategories(guild)
	const channels = await fetchChannels(guild)
	const emojis = await fetchEmojis(guild)
	const roles = await fetchRoles(guild)

	const backupId = SnowflakeUtil.generate(Date.now())
	const merged = Object.assign({
		_id: Types.ObjectId(),
		backupID: backupId,
		gName: guild.name,
		gID: guild.id,
		gDescription: guild.description,
		gIcon: guild.iconURL(),
		gBans: bans,
		gCategories: categories,
		gChannels: channels,
		gEmojis: emojis,
		gRoles: roles
	});
	const createGuild = new GuildDB(merged);
	await createGuild.save();
	return backupId;
}

async function fetchBans(guild: Guild) {
	const bans: string[] = [];
	const bansFetch = await guild.bans.fetch()
	bansFetch.each(b => {
		bans.push(b.user.id)
	})
	return bans
}

async function fetchCategories(guild: Guild) {
	const categories: any[] = [];
	const channelsFetch = await guild.channels.fetch()
	const categoriesFilter = channelsFetch.filter(c => c.type === 'GUILD_CATEGORY')
	for (const [_, cat] of categoriesFilter) {
		const permissions: any[] = []
		for (const p of cat.permissionOverwrites.cache.values()) {
			permissions.push({
				id: p.id,
				type: p.type,
				deny: p.deny.bitfield.toString(),
				allow: p.allow.bitfield.toString()
			})
		}
		categories.push({
			name: cat.name,
			rawPosition: cat.rawPosition,
			permissionOverwrites: permissions
		})
	}
	return categories
}

async function fetchChannels(guild: Guild) {
	const channels: any[] = [];
	const channelsFetch = await guild.channels.fetch()
	const channelsFilter: any = channelsFetch.filter(c => c.type !== 'GUILD_CATEGORY')
	for (const [_, cha] of channelsFilter) {
		const permissions: any[] = []
		for (const p of cha.permissionOverwrites.cache.values()) {
			permissions.push({
				id: p.id,
				type: p.type,
				deny: p.deny.bitfield.toString(),
				allow: p.allow.bitfield.toString()
			})
		}
		channels.push({
			name: cha.name,
			type: cha.type,
			rawPosition: cha.rawPosition,
			parent: cha.parent.name,
			permissionOverwrites: permissions,
			topic: cha.topic || '',
			nsfw: cha.nsfw || false,
		})
	}
	return channels;
}

async function fetchEmojis(guild: Guild) {
	const emojisFetch = await guild.emojis.fetch();
	const emojis: any[] = []
	for (const [_, emot] of emojisFetch) {
		emojis.push({
			name: emot.name,
			animated: emot.animated,
			id: emot.id
		})
	}
	return emojis
}

async function fetchRoles(guild: Guild) {
	const roles: any[] = []
	const rolesFetch = await guild.roles.fetch();
	for (const [_, r] of rolesFetch) {
		roles.push({
			name: r.name,
			color: r.color,
			rawPosition: r.rawPosition,
			permissions: r.permissions.bitfield.toString(),
		})
	}
	return roles;
}