# Discord-backup

A library for simplify the creation of backup system.

This module host data in mongodb database.

## Usage

- Create à new instance of DiscordBackup :

```js
const backup = new DiscordBackup(client);
```

### creat(guild)
- Params :
 - guild : Guild
-Return : Promise<undefined>

### load(backupId)
- Params :
 - backupId : Snowflake
-Return : Promise<undefined>

## Example :

```js
const {DiscordBackup} = require('discord-backup');

```
