import type { Client, Guild } from "discord.js";
import type { IOptions, IObject, IOptionsLoad } from './typescript/interfaces';
export declare class DiscordBackup {
    client: Client;
    database: IObject | undefined;
    constructor(client: Client, options: IOptions);
    create(guild: Guild): Promise<string>;
    load(guild: Guild, options: IOptionsLoad): Promise<boolean>;
    initDB(): void;
}
