import type { Client, Guild, GuildMember } from "discord.js";

export interface IDatabase {
    url: string;
}

export interface BackupOptions {
    client: Client;
    database: IDatabase;
}

export interface CreateOptions {
    guild: Guild;
    backupOwner: GuildMember;
}

export interface LoadOptions {
    guild: Guild;
    backupId: string;
}