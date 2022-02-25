// Require the necessary discord.js classes
const fs = require('fs');
const config = require('./config.json');
const package = require('./package.json');

console.log(`========= YOICHI BOT v${package.version} =========`);

// modulos do discordjs
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES] });

// Modulos do Express
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

// Modulos do Socket.io
const { Server } = require("socket.io");
const io = new Server(server);

// modulos customizados
require('./modulos/spotify')(io, client);

// cria um array com todas os arquivos de eventos
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// loop com todos os eventos, inserindo eles como módulos
for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    if (event.once) { // checa se o modulo tem "once" como um dos parâmetros
        if (event.socket) { // checa se o módulo tem o socket como um dos parâmetros. Se tiver, a gente passa o objeto do socket.io como o primeiro parâmetro da função
            client.once(event.name, (...args) => event.execute(io, ...args));
        } else {
            client.once(event.name, (...args) => event.execute(...args));
        }

    } else {
        if (event.socket) { // checa se o módulo tem o socket como um dos parâmetros. Se tiver, a gente passa o objeto do socket.io como o primeiro parâmetro da função
            client.on(event.name, (...args) => event.execute(io, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}

// client.on('presenceUpdate', (...args) => spotify.update(io, ...args));

// get commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./comandos/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

// Login to Discord with your client's token
client.login(config.token);

// Inicia servidor Express
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

app.get('/spotify', (req, res) => {
    res.sendFile(__dirname + '/pages/spotify.html');
});

server.listen(3000, () => {
    console.log(':: Iniciado servidor web na porta 3000');
});

