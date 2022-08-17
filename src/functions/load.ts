import {
	CategoryChannel,
	Guild,
	OverwriteResolvable,
	OverwriteType,
} from 'discord.js';
import type { IGuildBackup } from '../models/guild';
import GuildBackup from '../models/guild';
import { ChannelType } from 'discord.js';
import { wait } from '../util/wait';

export async function load(guild: Guild, backupId: string) {
	const guildDB = await GuildBackup.findOne({ backupID: backupId });

	if (!guildDB) throw new Error('Could not find guild backup ' + backupId);
	await prepar(guild);
	await loadRoles(guild, guildDB);
	await loadCategories(guild, guildDB);
	await loadChannels(guild, guildDB);
	await loadEmojis(guild, guildDB);
	await loadBans(guild, guildDB);
	return true;
}

async function prepar(guild: Guild): Promise<void> {
	// Fetch
	const g = await guild.fetch();
	// Delete all

	//Roles
	for (const role of g.roles.cache.values()) {
		try {
			if (role.id !== role.guild.id && role.editable) {
				if (g.members.me!.roles.highest.comparePositionTo(role) <= 0)
					continue;
				await role.delete();
				await wait(100);
			}
		} catch (e) {}
	}
	// Channels
	for (const channel of g.channels.cache.values()) {
		try {
			if (!channel.isThread() && channel.deletable) {
				await channel.delete();
				await wait(100);
			}
		} catch (e) {}
	}
	// Emojis
	for (const emoji of g.emojis.cache.values()) {
		try {
			if (emoji.deletable) {
				await emoji.delete();
				await wait(100);
			}
		} catch (e) {}
	}
}

async function loadCategories(guild: Guild, backup: IGuildBackup) {
	for (const category of backup.guildCategories) {
		await wait(100);
		const permissionOverwrites: OverwriteResolvable[] =
			category.permissionOverwrites.map(perm => ({
				id: perm.id,
				type: perm.type,
				allow: BigInt(perm.allow),
				deny: BigInt(perm.deny),
			}));

		await guild.channels.create({
			type: ChannelType.GuildCategory,
			name: category.name,
			position: category.rawPosition,
			permissionOverwrites,
		});
	}
	return true;
}

async function loadChannels(guild: Guild, backup: IGuildBackup) {
	for (const channel of backup.guildChannels) {
		const parent = guild.channels.cache.find(
			chan =>
				chan.type === ChannelType.GuildCategory &&
				chan.name === channel.parent,
		);
		await wait(100);

		const permissionOverwrites: OverwriteResolvable[] =
			channel.permissionOverwrites.map(perm => ({
				id: perm.id,
				type: perm.type,
				allow: BigInt(perm.allow),
				deny: BigInt(perm.deny),
			}));

		await guild.channels.create({
			type: channel.type,
			name: channel.name,
			position: channel.rawPosition,
			parent: parent?.id,
			userLimit: channel.slots,
			topic: channel.topic,
			rateLimitPerUser: channel.slowMode,
			nsfw: channel.nsfw,
			permissionOverwrites,
		});
	}
	return true;
}

async function loadRoles(guild: Guild, backup: IGuildBackup) {
	for (const role of backup.guildRoles) {
		await wait(100);
		await guild.roles.create({
			name: role.name,
			color: role.color,
			position: role.rawPosition,
			permissions: BigInt(role.permissions),
		});
	}
}

async function loadEmojis(guild: Guild, backup: IGuildBackup) {
	backup.guildEmojis.forEach(async emoji => {
		await wait(100);
		await guild.emojis.create({
			name: emoji.name,
			attachment: `https://cdn.discordapp.com/emojis/${emoji.id}.${
				emoji.animated ? 'gif' : 'png'
			}`,
		});
	});
}

async function loadBans(guild: Guild, backup: IGuildBackup) {
	backup.guildBans.forEach(async ban => {
		await wait(100);
		await guild.bans.create(ban, { reason: 'Backup restored' });
	});
}
