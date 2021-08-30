const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde com Pong! (Só pra ver se o bot tá funcionando kkkk)'),
    async execute(interaction) {
        await interaction.reply({ content: 'Pong!', ephemeral: true });
    },
};