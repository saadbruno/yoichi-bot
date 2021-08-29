const config = require("../config.json");
const { Permissions } = require('discord.js');

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purgerole')
        .setDescription('Remove todo mundo de uma determinada role')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('A role / cargo pra tirar todo mundo')
                .setRequired(true)
        ),
    async execute(interaction) {

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            console.log('\n\n:: [purgerole]: Usuário sem permissão executou o comando. Abortando.');
            return interaction.reply({ content: 'Você não tem permissão pra isso! Você não manda em mim!', ephemeral: true });
        }

        const role = interaction.options.getRole('role');

        console.log(`   :: [purgerole] A role "${role.name}" possui ${role.members.size} membros no cache.`);

        role.members.forEach(member => {
            console.log(`   :: [purgerole] Removendo role ${role.name} do usuário ${member.user.tag}`);
            member.roles.remove(role)
                .catch(error => console.error(`\n:: [purgerole] ERRO: Não foi possivel remover a role ${role.name} do usuário ${member.user.tag}. O bot tem permissão pra fazer isso?\n\n`, error));
        });

        await interaction.reply({ content: `Removendo ${role.members.size} usuários da role ${role.name}.`, ephemeral: true });

    },
};
