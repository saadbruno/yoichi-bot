const fetch = require('node-fetch');
const config = require("../config.json");

module.exports = {
    name: 'avatar',
    description: 'Troca o avatar do Bot',
    execute(message, args) {

        // Se a mensagem NÃO vier de:
        // - Um usuário que tenha permissão de Administrador
        // - Um servidor autorizado
        // simultaneamente, cancela execução do comando
        if (!(config.servidoresAutorizados.includes(message.channel.guild.id) && message.member.hasPermission('ADMINISTRATOR'))) {
            console.log('\n\n:: [WARN 5] Avatar: Alguém tentou usar o comando de Avatar, mas não tem permissão de admin em nenhum servidor autorizado');
            return message.reply(`Você não manda em mim!! <${config.emoteBrabo}>`);
        }

        // verifica se a mensagem tem um argumento. Se não tiver, cancela execução do comando
        if (!args.length) {
            // se não tiver um argumento na mensagem
            console.error("\n\n:: [ERRO 1] Avatar: Usuário não enviou um argumento");
            return message.reply(`Trocar pra o que? Manda a foto, né!`);
        }

        // verifica se o argumento é um link
        fetch(args[0])
            .then(res => {

                // se não for uma imagem, cancela execução do comando
                if (!res.headers.get('content-type').startsWith('image')) {
                    console.error(`\n\n:: [ERRO 3] Avatar: Link não é uma imagem`);
                    return message.reply(`Tem que ser uma imagem, né! <${config.emoteBrabo}>`);
                }

                // Se você chegou aqui, é uma imagem! Finalmente!
                console.log(`\n\n:: [INFO] Alterando avatar para ${args[0]}`);

                // Tenta trocar o avatar
                message.client.user.setAvatar(args[0]).catch((error) => {
                    console.error(`\n\n:: [ERRO 4] Avatar: Erro ao tentar trocar o avatar\n    ${error}`);
                    return message.reply(`Não consigo! <${config.emoteBrabo}>`);
                });
                return message.reply(`Trocando meu avatar! <${config.emoteEnvergonhado}>`);

            })
            .catch((error) => {
                // se o fetch falhou, é pq o argumento não é um link.
                console.error(`\n\n:: [ERRO 2] Avatar: Argumento não é um link\n    ${error}`);
                return message.reply(`Tem que ser um link de uma imagem, né! <${config.emoteBrabo}>`);
            });

    },
};
