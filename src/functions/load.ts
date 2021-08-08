import type { Guild } from "discord.js";
import type { IBackup, IObject } from "../typescript/interfaces";
import { GuildDB } from '../models/index';
import { wait } from '../util/wait';

export async function load(guild: Guild, backupId: string) {
	const guildDB = await GuildDB.findOne({ backupID: backupId })

	if (!guildDB) throw new Error('Could not find guild backup ' + backupId);
	await prepar(guild)
	await loadRoles(guild, guildDB)
	await loadCategories(guild, guildDB)
	await loadChannels(guild, guildDB)
	await loadEmojis(guild, guildDB)
	await loadBans(guild, guildDB)
	return true
}


async function prepar(guild: Guild): Promise<void> {
	// Fetch
	const g = await guild.fetch()
	// Delete all

	//Roles
	for (const role of g.roles.cache.values()) {
		try {
			if (role.id !== role.guild.id && role.editable) {
				if (g.me!.roles.highest.comparePositionTo(role) <= 0) continue;
				await role.delete();
				await wait(100);
			}
		} catch (e) {
		}
	};
	// Channels 
	for (const channel of g.channels.cache.values()) {
		try {
			if (!channel.isThread() && channel.deletable) {
				await channel.delete();
				await wait(100);
			}
		} catch (e) {
		}
	};
	// Emojis
	for (const emoji of g.emojis.cache.values()) {
		try {
			if (emoji.deletable) {
				await emoji.delete();
				await wait(100);
			}
		} catch (e) {
		}
	};
}

async function loadCategories(guild: Guild, backup: IBackup) {

	for (const cat of backup.gCategories) {
		await wait(100)
		cat.permissionOverwrites.forEach((p: IObject) => {
			p.allow = BigInt(p.allow)
			p.deny = BigInt(p.deny)
		})

		await guild.channels.create(cat.name, {
			type: 'GUILD_CATEGORY',
			position: cat.rawPosition,
			permissionOverwrites: cat.permissionOverwrites
		})
	}
}
async function loadChannels(guild: Guild, backup: IBackup) {
	for (const ch of backup.gChannels) {
		const parent: any = guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY' && c.name === ch.parent).first()
		await wait(100)
		ch.permissionOverwrites.forEach((p: IObject) => {
			p.allow = BigInt(p.allow)
			p.deny = BigInt(p.deny)
		})
		await guild.channels.create(ch.name, {
			type: ch.type,
			topic: ch.topic,
			position: ch.rawPosition,
			permissionOverwrites: ch.permissionOverwrites,
			parent: parent
		})
	}
}

async function loadRoles(guild: Guild, backup: IBackup) {
	for (const r of backup.gRoles) {
		await wait(100)
		await guild.roles.create({
			name: r.name,
			color: r.color,
			position: r.position,
			permissions: BigInt(r.permissions)
		})
	}
}

async function loadEmojis(guild: Guild, backup: IBackup) {
	for (const e of backup.gEmojis) {
		await wait(100)
		await guild.emojis.create(`https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? 'gif' : 'png'}`, e.name)
	}
}

async function loadBans(guild: Guild, backup: IBackup) {
	for (const b of backup.gBans) {
		await wait(100)
		await guild.bans.create(b, { reason: 'Backup' })
	}
}