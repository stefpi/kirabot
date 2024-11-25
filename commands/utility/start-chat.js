const { SlashCommandBuilder } = require("discord.js");

const infera = require('../../requests/infera');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kira')
		.setDescription('Start a DM conversation with Kira!'),
	async execute(interaction) {
    await interaction.reply({ content: "sending a message to your DMs shortly...", ephemeral: true })

    const channel = await interaction.member.user.createDM();

    const messages = [{
      "role": "user",
      "content": "Hello Kira!"
    }];

    const response = await infera.get(messages, channel);

    channel.send(response);
	},
};
