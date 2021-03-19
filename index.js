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
  ]
}

// Escuta por mensagens
client.on('message', message => {
  if (message.content.toLowerCase().includes("yoichi")) {
    message.react(config.emoteBrabo);

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

  if (message.content.toLowerCase().includes("caleb")) {
    message.react(config.emoteEnvergonhado);
  }

  if (message.mentions.has(client.user)) {
    message.channel.send("<" + config.emoteBrabo + ">");
  }

});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(config.token);
