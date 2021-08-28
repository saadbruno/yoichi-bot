module.exports = {
    name: 'interactionCreate',
    execute(interaction) {
        console.log(`:: ${interaction.user.tag} ativou uma interação em #${interaction.channel.name}`);
        // console.log(interaction);

        if (!interaction.isCommand()) return;

        console.log(`   └─ comando ${interaction.commandName}`);

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            command.execute(interaction);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Houve um erro a executar o comando!', ephemeral: true });
        }
    },
};