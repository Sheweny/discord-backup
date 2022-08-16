import { Client, GatewayIntentBits, Message, Partials, TextChannel } from 'discord.js';
import { DiscordBackup } from '..';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
	],
	partials: [
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.Reaction,
		Partials.User,
		Partials.ThreadMember,
	],
});

client.once('ready', () => {
	console.log(`Logged in as ${client.user?.tag}`);
});

const backup = new DiscordBackup({
	client,
	database: {
		url: 'mongodb://localhost:27017/',
	},
});

client.on('messageCreate', async (message: Message) => {
	if (!message.member) return;
	if (!message.guild) return;

	if (message.content === '.create') {
		const b = await backup.create({
			guild: message.guild,
			backupOwner: message.member,
		});
		message.reply(`Backup ID: ${b}`);
	}
	if (message.content.startsWith('.load')) {
		const args = message.content.split(' ');
		if (args.length === 2) {
			const b = await backup.load({
				guild: message.guild,
				backupId: args[1],
			});
			console.log('Backup: ' + b);
		}
	}
});

client.login(
	'OTY2MjkyOTc1MDIzOTYwMDY0.G10wFp.fw3xv_zKftqf7mP5UYvQwKeXLjBDghu6jbSy2o',
);
