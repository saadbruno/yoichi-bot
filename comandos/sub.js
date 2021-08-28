const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sub')
        .setDescription('Como linkar sua conta da Twitch'),
    async execute(interaction) {
        await interaction.reply({
            content: 'Se você é **sub na Twitch** e quiser acesso ao **canal exclusivo dos subs**, lembre-se de conectar sua Twitch à sua conta do Discord! \n*(Após realizar a conexão, pode levar até 1 hora pro Discord sincronizar os cargos)*!',
            files: ["https://cdn.discordapp.com/attachments/770002916374478869/873352673510977536/twitch-sub-role.png"]
        })
            .catch(console.error);
    },
};