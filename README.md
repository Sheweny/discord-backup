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

const {Client, Intents} = require('discord.js');

const client = new Client({intents:Intents.NON_PRIVILEGED});

client.on('message', async msg => {
  const args = msg.content.split(' ');
  const commandName = args.shift();
  if(commandName === 'create-backup') {
    const guild = message.guild;
    backup.create(guild).then(()=>message.reply('OK'))
  } 
  if(commandName === 'load-backup') {
    backup.load(args[0]) 
  } 
})

client.login('token')
```
