const fetch = require('node-fetch');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Troca o avatar do bot')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Link pro novo avatar')
                .setRequired(true)
        ),
    async execute(interaction) {

        // checa se o membro é manager
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            console.log('   :: [avatar]: Usuário sem permissão executou o comando. Abortando.');
            return interaction.reply({ content: 'Você não tem permissão pra isso! Você não manda em mim!', ephemeral: true });
        }

        const url = interaction.options.getString('url');

        // verifica se o argumento é um link
        fetch(url)
            .then(res => {

                // se não for uma imagem, cancela execução do comando
                if (!res.headers.get('content-type').startsWith('image')) {
                    console.error(`   :: [Avatar - Erro] Link não é uma imagem`);
                    return interaction.reply({ content: 'Tem que ser um link de uma imagem, né!', ephemeral: true });
                }

                // Tenta trocar o avatar
                interaction.client.user.setAvatar(url)
                    .then(user => {
                        console.log(`   :: [avatar]: Trocando avatar do bot para ${url}`);
                        return interaction.reply({ content: 'Trocando avatar!', ephemeral: true });
                    })
                    .catch((error) => {
                        console.error(`   :: [Avatar - Erro] Erro ao tentar trocar o avatar\n   ${error}`);
                        return interaction.reply({ content: 'Erro ao trocar o avatar', ephemeral: true });
                    });

            })
            .catch((error) => {
                // se o fetch falhou, é pq o argumento não é um link.
                console.error(`   :: [Avatar - Erro] Argumento não é um link\n   ${error}`);
                return interaction.reply({ content: 'Tem q ser um link né o carai', ephemeral: true });
            });

    },
};
