const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify')
        .setDescription('teste do spotify'),
    async execute(interaction) {
        let id = '192723087429599232';
        let guild = interaction.client.guilds.cache.get('646491979651350547');
        let discordMember = await guild.members.fetch(id);
        console.log(discordMember.presence);
        // console.log(interaction);
        await interaction.reply({ content: 'Pong!', ephemeral: true });
    },
};