'use strict';

const config = require("./config.json");

// Import the discord.js module
const Discord = require('discord.js');
const fetch = require('node-fetch');

// Create an instance of a Discord client
const client = new Discord.Client();


client.on('ready', () => {
    console.log('YOICHI LIVES!');
});


//Reply's do Yoichi
const replies = {
    "fuckers": [
        "TODO DIA ISSO",
        "bitch."
    ],
    "dia": [
        "BOM DIA PRA QUEM?? ",
        "Bom dia. "
    ],
    "noite": [
        "Boa noite.",
        "Eu não durmo..."
    ],
    "calichi": [
        "minha relação não é um ship, pelo amor de deus",
        "mais um fã clube, Yoichi Fuckers?",
        "mais essa agora...",
        "que tal parar de falar do meu relacionamento como se eu não tivesse aqui?",
        "Caleb, por favor... faz isso parar..."
    ]
}

// Escuta por mensagens
client.on('message', message => {

    // se o bot receber uma mensagem de outro bot, ignorar. Isso previne loop infinitos.
    if(message.author.bot) {
        console.log("recebida mensagem de um bot. Ignorando.")
        return;
    }

    // comandos que começam com o prefixo
    if (message.content.startsWith(config.prefixo)) {

        const args = message.content.slice(config.prefixo.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        // comando pra trocar o avatar
        // USO: !avatar <link>
        if (command === 'avatar') {
            
            // verifica se a mensagem veio de um admin
            if (message.member.hasPermission('ADMINISTRATOR')) {
                // verifica se a mensagem tem um argumento
                if (!args.length) {
                    // se não tiver um argumento na mensagem
                    console.error("\n\n:: [ERRO 1] Avatar: Usuário não enviou um argumento");
                    return message.channel.send(`Trocar pra o que? Manda a foto, né, ${message.author}!`);
                } else {
                    // verifica se o link é uma imagem
                    fetch(args[0])
                        .then(res => {
                            if (res.headers.get('content-type').startsWith('image')) {
                                // é uma imagem!
                                console.log(`\n\n :: [INFO] Alterando avatar para ${args[0]}`);
                                // troca o avatar
                                client.user.setAvatar(args[0]).catch((error) => {
                                    console.error(`\n\n:: [ERRO 4] Avatar: Erro ao tentar trocar o avatar\n${error}\n\n`);
                                    return message.reply(`Não consigo! <${config.emoteBrabo}>`);
                                });
                                return message.reply(`Trocando meu avatar! <${config.emoteEnvergonhado}>`);

                            } else {
                                console.error(`\n\n:: [ERRO 3] Avatar: Link não é uma imagem`);
                                return message.reply(`Tem que ser uma imagem, né! <${config.emoteBrabo}>`);
                            }
                        })
                        .catch((error) => {
                            console.error(`\n\n:: [ERRO 2] Avatar: Argumento não é um link\n${error}\n\n`);
                            return message.reply(`Tem que ser uma imagem, né! <${config.emoteBrabo}>`);
                        });
                }
            } else {
                console.log('\n\n:: [WARN 5] alguem tentou usar o comando de Avatar, mas não tem permissão de admin');
                return message.reply(`Você não manda em mim!! <${config.emoteBrabo}>`);
            }

        }
        return
    }

    // caso o bot leia "yoichi" no chat
    if (message.content.toLowerCase().includes("yoichi")) {

        // reage com o emoteBrabo
        message.react(config.emoteBrabo);

        // respostas adicionais. Se ouvir "fuckers", "dia", ou "noite".
        if (message.content.toLowerCase().includes("fucker")) {

            var r = ~~(Math.random() * replies.fuckers.length);
            message.reply(replies.fuckers[r]);
            return;
        } else if (message.content.toLowerCase().includes("dia")) {

            var r = ~~(Math.random() * replies.dia.length);
            message.reply(replies.dia[r] + "<" + config.emoteBrabo + ">");
            return;
        } else if (message.content.toLowerCase().includes("noite")) {

            var r = ~~(Math.random() * replies.noite.length);
            message.reply(replies.noite[r]);
            return;
        }
    }
    
    // caso o bot leia "calichi" no chat
    if (message.content.toLowerCase().includes("calichi")) {

            var r = ~~(Math.random() * replies.calichi.length);
            message.reply(replies.calichi[r]);
            return;
    }

    // caso o bot leia "caleb" no chat
    if (message.content.toLowerCase().includes("caleb")) {
        message.react(config.emoteEnvergonhado);
    }

    // caso alguém mencione o bot no chat
    if (message.mentions.has(client.user)) {

        // e caso tenha "dia" na mensagem
        if (message.content.toLowerCase().includes("dia")) {

            var r = ~~(Math.random() * replies.dia.length);
            message.reply(replies.dia[r] + "<" + config.emoteBrabo + ">");
            return;
        // caso tenha "noite"
        } else if (message.content.toLowerCase().includes("noite")) {

            var r = ~~(Math.random() * replies.noite.length);
            message.reply(replies.noite[r]);
            return;
        // caso contrário, só responde com o emoteBrabo
        } else {
            message.channel.send("<" + config.emoteBrabo + ">");
            return;
        }

    }

});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(config.token);
