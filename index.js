const fs = require('fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
require('dotenv').config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commands = {}
const commandsJSON = []

// Loading Commands
console.log("Loading Commands...")

fs.readdirSync("./commands").map((path) => {
    const cmd = require("./commands/"+path) 
	commands[cmd.data.name] = cmd
	commandsJSON.push(cmd.data.toJSON())
});

// Deploying Commands
(async () => {
	try {
		console.log(`Started refreshing ${commandsJSON.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
			{ body: commandsJSON },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = commands[interaction.commandName];

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.TOKEN);