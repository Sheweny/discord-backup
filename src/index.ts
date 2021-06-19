import mongoose from 'mongoose';
import type { Client, Guild } from "discord.js";
import type { IOptions, IObject, IOptionsLoad } from './typescript/interfaces';
import { create, load } from './functions/index';
// import { existsSync } from 'fs';
// import { join } from 'path';
export class DiscordBackup {
	client: Client;
	// directory: string;
	database: IObject | undefined;
	constructor(client: Client, options: IOptions) {
		this.client = client;
		// // this.directory = options?.directory ?? 'backups';
		if (options?.database) {
			this.database = {
				url: options?.database
			}
			this.initDB()
		}

		// if (existsSync(join(__dirname, this.directory)))
	}
	create(guild: Guild) {
		create(guild)
	}
	load(guild: Guild, options: IOptionsLoad) {
		console.log(options);

		load(guild, options.id)
	}
	initDB() {
		mongoose.connect(this.database!.url, { useNewUrlParser: true, useUnifiedTopology: true });
	}
}