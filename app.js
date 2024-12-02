require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');

const { Client, GatewayIntentBits, Partials, Collection, Events, ChannelType } = require("discord.js");

const infera = require('./requests/infera');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
})

/* Command Handler */
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
})
/* Command Handler */

function historyToContext(historyCollection) {
  historyCollection.sort((a,b) => {
    return a.createdTimestamp - b.createdTimestamp;
  });

  // mash together multiple sequential "user" and "assistant" messages
  // TODO: be smarter and sort the whole history to be user, assistant, user, ...

  const history = Array.from(historyCollection.values());

  const context = [];

  let content = "";

  for (let i=0; i < history.length; i++) {
    const currMsg = history[i];

    if (currMsg.author.id == client.user.id) {
      role = "assistant";
    } else {
      role = "user";
    }

    content += "\n" + currMsg.content;

    if ((i+1) < history.length) {
      const nextMsg = history[i+1];
      if (nextMsg.author.id != currMsg.author.id) {
        context.push({
          "role": role,
          "content": content,
        });
        content = "";
      }
    } else {
      context.push({
        "role": role,
        "content": content,
      });
    }
  }

  return context;
}

client.on(Events.MessageCreate, async message => {
  if (message.content.startsWith("/")) {
    return;
  }

  if (client.user.id != message.author.id && message.channel.type === ChannelType.DM) {
    
    const channel = client.channels.cache.get(message.channelId)

    const messagesMetaData = await channel.messages.fetch({ limit: 50 });

    const messages = historyToContext(messagesMetaData);

    console.log('--------------------------')

    console.log("user: ", message.author.displayName);
    console.log("message: ", message.content);

    await message.channel.sendTyping();

    const response = await infera.get(messages, message.channel);

    await message.reply(response);

    console.log('--------------------------')
  }
});

client.login(process.env.BOT_TOKEN);