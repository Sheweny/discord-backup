import type { OverwriteType, Snowflake } from 'discord.js';
import { Schema, model } from 'mongoose';

export interface IPermissions {
	id: Snowflake;
	type: OverwriteType;
	deny: string;
	allow: string;
}

export interface ICategory {
	name: string;
	rawPosition: number;
	permissionOverwrites: IPermissions[];
}

export interface IChannel {
	name: string;
	type: number;
	rawPosition: number;
	parent?: string;
	permissionOverwrites: IPermissions[];
	topic?: string;
	nsfw?: boolean;
	slots?: number;
	slowMode?: number;
}

export interface IEmoji {
	name: string;
	animated: boolean;
	id: Snowflake;
}

export interface IRole {
	name: string;
	color: number;
	rawPosition: number;
	permissions: string;
}

export interface IGuildBackup {
	backupId: string;
	createdAt: Date;
	backupOwner: string;
	guildId: Snowflake;
	guildName: string;
	guildDescription?: string;
	guildIcon?: string;
	guildBans: Snowflake[];
	guildCategories: ICategory[];
	guildChannels: IChannel[];
	guildEmojis: IEmoji[];
	guildRoles: IRole[];
}

const GuildBackupSchema = new Schema({
	backupId: { type: String, required: true },
	createdAt: { type: Date, required: true },
	backupOwner: { type: String, required: true },
	guildId: { type: String, required: true },
	guildName: { type: String, required: true },
	guildDescription: { type: String, required: false },
	guildIcon: { type: String, required: false },
	guildBans: [{ type: String, required: true }],
	guildCategories: [
		{
			name: { type: String, required: true },
			rawPosition: { type: Number, required: true },
			permissionOverwrites: [
				{
					id: { type: String, required: true },
					type: { type: Number, required: true },
					deny: { type: String, required: true },
					allow: { type: String, required: true },
				},
			],
		},
	],
	guildChannels: [
		{
			name: { type: String, required: true },
			type: { type: Number, required: true },
			rawPosition: { type: Number, required: true },
			parent: { type: String, required: false },
			permissionOverwrites: [
				{
					id: { type: String, required: true },
					type: { type: Number, required: true },
					deny: { type: String, required: true },
					allow: { type: String, required: true },
				},
			],
			topic: { type: String, required: false },
			nsfw: { type: Boolean, required: false },
			slots: { type: Number, required: false },
			slowMode: { type: Number, required: false },
		},
	],
	guildEmojis: [
		{
			name: { type: String, required: true },
			animated: { type: Boolean, required: true },
			id: { type: String, required: true },
		},
	],
	guildRoles: [
		{
			name: { type: String, required: true },
			color: { type: Number, required: true },
			rawPosition: { type: Number, required: true },
			permissions: { type: String, required: true },
		},
	],
});

const GuildBackup = model<IGuildBackup>('Backup', GuildBackupSchema);
export default GuildBackup;
