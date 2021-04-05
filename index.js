'use strict';

const config = require("./config.json");

// Import the discord.js module
const Discord = require('discord.js');

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

    // caso o bot leia "yoichi" no chat
    if (message.content.toLowerCase().includes("yoichi")) {

        // reage com o emoteBrabo
        message.react(config.emoteBrabo);

        // respostas adicionais. Se ouvir "fuckers", "dia", ou "noite".
        if (message.content.toLowerCase().includes("fuckers")) {

            var r = ~~(Math.random() * replies.fuckers.length);
            message.reply(replies.fuckers[r]);

        } else if (message.content.toLowerCase().includes("dia")) {

            var r = ~~(Math.random() * replies.dia.length);
            message.reply(replies.dia[r] + "<" + config.emoteBrabo + ">");

        } else if (message.content.toLowerCase().includes("noite")) {

            var r = ~~(Math.random() * replies.noite.length);
            message.reply(replies.noite[r]);

        }
    }
    
    // caso o bot leia "calichi" no chat
    if (message.content.toLowerCase().includes("calichi")) {

            var r = ~~(Math.random() * replies.calichi.length);
            message.reply(replies.calichi[r]);
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

        // caso tenha "noite"
        } else if (message.content.toLowerCase().includes("noite")) {

            var r = ~~(Math.random() * replies.noite.length);
            message.reply(replies.noite[r]);

        // caso contrário, só responde com o emoteBrabo
        } else {
            message.channel.send("<" + config.emoteBrabo + ">");
        }

    }

});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(config.token);
