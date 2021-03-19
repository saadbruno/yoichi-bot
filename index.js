'use strict';

var config = require( "./config.json" ); 

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();


client.on('ready', () => {
  console.log('YOICHI LIVES!');
});


//Reply's do Yoichi
  //
  const replyFKRS = [
  "TODO DIA ISSO",
  "bitch."
];

  const replyDIA = [
  "BOM DIA PRA QUEM?? ",
  "Bom dia. "
];

  const replyNOIT = [
  "Boa noite.",
  "Eu não durmo..."
];



// Create an event listener for messages
client.on('message', message => {
  if (message.content.toLowerCase().includes("yoichi")) {
    message.react(config.emoteBrabo);
  }
  if (message.content.toLowerCase().includes("caleb")) {
    message.react(config.emoteEnvergonhado);
  }
  if (message.mentions.has(client.user)) {
    message.channel.send("<" + config.emoteBrabo + ">");
  }
  
  if (message.content.toLowerCase().includes("yoichi fuckers")) {
  const randomFKRS = ~~(Math.random() * replyFKRS.length);
    message.reply(replyFKRS[randomFKRS]);
  }

  if (message.content.toLowerCase().includes("dia yoichi")) {
  const randomDIA = ~~(Math.random() * replyDIA.length);
    message.reply(replyDIA[randomDIA] + config.emoteBrabo);
  }

  if (message.content.toLowerCase().includes("noite yoichi")) {
  const randomNOIT = ~~(Math.random() * replyNOIT.length);
    message.reply(replyNOIT[randomNOIT]);
  }
  
  
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(config.token);
