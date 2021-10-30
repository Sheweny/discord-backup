import mongoose from "mongoose";
import type { Client, Guild } from "discord.js";
import type { IOptions, IObject, IOptionsLoad } from "./typescript/interfaces";
import { create, load } from "./functions/index";
export class DiscordBackup {
  client: Client;
  database: IObject | undefined;
  constructor(client: Client, options: IOptions) {
    this.client = client;
    if (options?.database) {
      this.database = {
        url: options?.database,
      };
      this.initDB();
    }
  }
  create(guild: Guild) {
    return create(guild);
  }
  load(guild: Guild, options: IOptionsLoad) {
    return load(guild, options.id);
  }
  initDB() {
    mongoose.connect(this.database!.url, {
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity  //45000
      family: 4, // Use IPv4, skip trying IPv6
    });
  }
}
