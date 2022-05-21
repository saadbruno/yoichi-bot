const path = require('path')
const config = require("../config.json");
const { CronJob } = require("cron");

// Modulos do Express
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

// Modulos do Socket.io
const { Server } = require("socket.io");
const io = new Server(server);

// modulos customizados


module.exports = {
    name: 'ready',
    once: true,
    execute(client) {

        // posta mensagem de início 
        console.log(`:: Logado no Discord como ${client.user.tag}\n:: Online em ${client.guilds.cache.size} servidores do Discord`);

        let guild = client.guilds.cache.get(config.guildId);

        // adiciona todos usuários ao cache do bot. No momento isso é utilizado no purgerole, e no spotify.
        guild.members.fetch().then((members) => {
            console.log(`:: Adicionados ${members.size} usuários do Discord no cache`);
            require('../modulos/spotify')(io, client); // modulo do overlay do spotify. Só fazemos isso após pegarmos a lista de membros
        });


        // =============
        // EXPRESS
        // =============
        app.get('/', (req, res) => {
            res.sendFile(path.resolve(__dirname, '..') + '/../pages/index.html');
        });

        app.get('/spotify', (req, res) => {
            res.sendFile(path.resolve(__dirname, '..') + '/pages/spotify.html');
        });

        server.listen(3000, () => {
            console.log(':: Iniciado servidor web na porta 3000');
        });

        // =============
        // CRON
        // =============

        // cron q remove o roleCounting todo dia 1 do mês
        new CronJob(
            "0 0 0 1 * *",
            () => {
                let role = guild.roles.cache.find(r => r.id === config.roleCounting);
                client.commands.get("purgerole").execute(role);
            },
            null,
            true,
            "America/Sao_Paulo"
        );

        // cron q posta a mensagem de aniversário as 10 da manhã
        new CronJob(
            "0 0 10 * * *",
            () => {
                client.commands.get("aniversário").execute(client, guild, "post");
            },
            null,
            true,
            "America/Sao_Paulo"
        );

        // cron que dá a role de aniversariante todo dia meia noite
        new CronJob(
            "0 0 0 * * *",
            () => {
                client.commands.get("aniversário").execute(client, guild, "giveRoles");
            },
            null,
            true,
            "America/Sao_Paulo"
        );

    },
};