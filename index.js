'use strict';

const config = require("./config.json");

const fs = require('fs');
const { CronJob } = require("cron");
// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// cria gerenciador de comandos. Essa parte pega todos os arquivos terminados em .js dentro da pasta "comandos", e cria um array com todos eles.
// isso serve pra separar cada comando prefixado (exemplo: !avatar) em um arquivo separado, pra organizar melhor o código.
// Tirado de https://discordjs.guide/command-handling/#dynamically-executing-commands
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./comandos/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// inicia o bot
client.on('ready', () => {
    console.log('YOICHI LIVES!');
});


//Reply's do Yoichi
// TO-DO: Mover isso pra um banco de dados
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
        return;
    }

    // comandos que começam com o prefixo
    if (message.content.startsWith(config.prefixo)) {

        // separa o comando específico e seus argumentos.
        // Exemplo: !avatar foo bar ---> Comando: "avatar" | Argumentos: "foo" e "bar"
        const args = message.content.slice(config.prefixo.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        console.log(`\n\n:: Executando comando!\n    :: Usuário: ${message.author.username}#${message.author.discriminator}\n    :: Comando: ${command}\n    :: Argumentos: ${args}`);

        // tenta executar o comando, dentro da pasta "commandos"
        try {
            client.commands.get(command).execute(message, args, client);
        } catch (error) {
            console.error(error);
        }

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

new CronJob(
    "0 0 14 * * *",
    () => {
        client.commands.get("aniversario").execute("", "", client);
    },
    null,
    true,
    "America/Sao_Paulo"
);

// Log our bot in using the token from https://discord.com/developers/applications
client.login(config.token);
