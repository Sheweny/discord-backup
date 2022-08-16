import mongoose from 'mongoose';
import type { Client } from 'discord.js';
import type {
	BackupOptions,
	CreateOptions,
	IDatabase,
	LoadOptions,
} from './typescript/interfaces';
import { create, load } from './functions/index';
export class DiscordBackup {
	private client: Client;
	private database: IDatabase;

	constructor(opts: BackupOptions) {
		this.client = opts.client;
		this.database = opts.database;
		this.initDB();
	}

	public create(opts: CreateOptions) {
		return create(opts.guild, opts.backupOwner);
	}

	public load(opts: LoadOptions) {
		return load(opts.guild, opts.backupId);
	}

	private initDB() {
		mongoose.connect(this.database!.url, {
			serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
			socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity  //45000
			family: 4, // Use IPv4, skip trying IPv6
		});
	}
}