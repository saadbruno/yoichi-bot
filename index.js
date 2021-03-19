'use strict';

var config = require( "./config.json" ); 

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();


client.on('ready', () => {
  console.log('YOICHI LIVES!');
});

// Create an event listener for messages
client.on('message', message => {
  if (message.content.toLowerCase().includes("yoichi")) {
    message.react(config.emoteBrabo);
  }
  if (message.content.toLowerCase().includes("caleb")) {
    message.react(config.emoteEnvergonhado);
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(config.token);