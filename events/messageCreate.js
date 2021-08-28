const config = require("../config.json");
const replies = require('../data/replies.json');

module.exports = {
    name: 'messageCreate',
    execute(message) {

        // se o bot receber uma mensagem de outro bot, ignorar. Isso previne loop infinitos.
        if (message.author.bot) {
            return;
        }

        // console.log(`:: ${message.author.tag} enviou uma mensagem em #${message.channel.name}: ${message.content}`);

        // caso o bot leia "yoichi" no chat
        if (message.content.toLowerCase().includes("yoichi")) {

            // reage com o emoteBrabo
            message.react(config.emoteBrabo);

            // respostas adicionais. Se ouvir "fuckers", "dia", ou "noite".
            if (message.content.toLowerCase().includes("fucker")) {
                var r = ~~(Math.random() * replies.fuckers.length);
                return message.reply(replies.fuckers[r]);
            }
            if (message.content.toLowerCase().includes("dia")) {
                var r = ~~(Math.random() * replies.dia.length);
                return message.reply(replies.dia[r] + "<" + config.emoteBrabo + ">");
            }
            if (message.content.toLowerCase().includes("noite")) {
                var r = ~~(Math.random() * replies.noite.length);
                return message.reply(replies.noite[r]);
            }
        }


        // caso o bot leia "calichi" no chat
        if (message.content.toLowerCase().includes("calichi")) {
            var r = ~~(Math.random() * replies.calichi.length);
            return message.reply(replies.calichi[r]);
        }

        // caso o bot leia "caleb" no chat
        if (message.content.toLowerCase().includes("caleb")) {
            message.react(config.emoteEnvergonhado);
        }

        // caso alguém mencione o bot no chat
        if (message.mentions.has(message.client.user)) {

            // e caso tenha "dia" na mensagem
            if (message.content.toLowerCase().includes("dia")) {
                var r = ~~(Math.random() * replies.dia.length);
                return message.reply(replies.dia[r] + "<" + config.emoteBrabo + ">");
            }

            // caso tenha "noite"
            if (message.content.toLowerCase().includes("noite")) {
                var r = ~~(Math.random() * replies.noite.length);
                return message.reply(replies.noite[r]);
            }
            // caso contrário, só responde com o emoteBrabo
            return message.reply("<" + config.emoteBrabo + ">");

        }

    },
};