const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purgerole')
        .setDescription('Remove todo mundo de uma determinada role')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('A role pra tirar todo mundo')
                .setRequired(true)
        ),
    async execute(interaction) {

        var role;

        // aqui a gente divide o código em 2 partes pra pegar a role desejada, dependendo se o comando foi executado via cron, ou via interação

        // Se a interação NÃO possui um membro, ela veio o cron configurado no ../events/ready.js
        // o cron 
        if (!interaction.member) {
            // console.log(interaction);
            console.log('   :: [purgerole]: Executando via Cron');
            role = interaction;
        } else {

            // checa se o membro é manager
            if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                console.log('   :: [purgerole]: Usuário sem permissão executou o comando. Abortando.');
                return interaction.reply({ content: 'Você não tem permissão pra isso! Você não manda em mim!', ephemeral: true });
            }

            role = interaction.options.getRole('role');
            await interaction.reply({ content: `Removendo ${role.members.size} usuários da role ${role.name}.`, ephemeral: true });
        }

        console.log(`   :: [purgerole] A role "${role.name}" possui ${role.members.size} membros no cache.`);

        role.members.forEach(member => {
            console.log(`   :: [purgerole] Removendo role ${role.name} do usuário ${member.user.tag}`);
            member.roles.remove(role)
                .catch(error => console.error(`\n   :: [purgerole] ERRO: Não foi possivel remover a role ${role.name} do usuário ${member.user.tag}. O bot tem permissão pra fazer isso?\n\n`, error));
        });

    },
};
