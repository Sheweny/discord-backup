# Discord-backup

A library for simplify the creation of backup system with mongodb database.
This module work with discord.js V13

## Getting Started

### Prerequisites

- Node.js 16.6.0 or newer is required.

- Discord.js 13.0.0 or newer is required.

### Instalation

With npm :

```sh-session
npm install @sheweny/backup
```

With yarn :

```sh-session
yarn add @sheweny/backup
```

## Usage

Import the module from node_modules :

With CommonJS syntax :

```js
const { DiscordBackup } = require("@sheweny/backup");
```

With module syntax :

```js
import { DiscordBackup } from "@sheweny/backup";
```

Create a new instance of `DiscordBackup` with the client as a parameter and the database in options :

```js
const backup = new DiscordBackup(client, {
  database: { 
    url : "mongodb://localhost:27017/discord-backup"
  },
});
```

## [async] DiscordBackup#create(guild)

Create a backup and save it to database.

Parameters :

- guild : The guild from create the backup (Guild).

Return : The id of the backup (Promise\<Snowflake>).

## [async] DiscordBackup#load(guild, options)

Load a backup from database to a specific guild.

Parameters :

- guild : The guild from load the backup (Guild).
- options : The options from load the backup (Object).
  - options.id : The id of the backup (Snowflake).
  - options.force : If the bot should delete the old server (Boolean).

Return : Promise\<boolean>.

## Example

```js
const { Client, Intents } = require("discord.js");
const { DiscordBackup } = require("@sheweny/backup");
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const backup = new DiscordBackup(client, {
  database: {url : "mongodb://localhost:27017/discord-backup"},
});
client.on("messageCreate", async (msg) => {
  const args = msg.content.split(" ");
  if (args[0] === "!create-backup") {
    console.log(await backup.create(msg.guild));
  }
  if (args[0] === "!load-backup") {
    backup.load(msg.guild, {
      id: args[1],
      force: true,
    });
  }
});
client.login("<discord bot token>");
```

## Authors

- [Smaug6739](https://github.com/Smaug6739)
- [Tech Genius](https://github.com/TechGenius7777)
