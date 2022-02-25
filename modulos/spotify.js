// script pra overlay customizado do Spotify.
// Acesse em localhost:3000/spotify

const config = require('../config.json');

// função que analisa as presenças e manda pra frontend pelo socket.io
function update(io, oldPresence, newPresence) {
    console.log(`\n:: Nova atualização de Presence`);

    // encontra, entre todas as atividades, o Spotify
    let spotify = newPresence.activities.find(function (item) {
        return item.name === 'Spotify';
    });

    // se não tiver Spotify entre as atividades, cancela execução
    if (!spotify) {
        console.log(`Sem Spotify entre as atividades.`);
        io.emit('spotify', 'test');
        return;
    }

    // Debug: Caso haja dados do Spotify, mostra no console.
    console.log(`
    User ID: ${newPresence.userId}
    Artist:  ${spotify.state}
    Song:    ${spotify.details}
    Album:   ${spotify.assets.largeText}
    Cover:   https://i.scdn.co/image/${spotify.assets.largeImage.slice(8)}
    `);

    // console.log(spotify);

    // envia dados do spotify pro overlay
    io.emit('spotify', spotify);

}

module.exports = function (io, client) {

    // quando discord deteca atualização do Rich Presence, a gente chama a função update
    client.on('presenceUpdate', (...args) => update(io, ...args));

    // qunado a página é aberta pela primeira vez, a gente pega a presença pelo cache do discord
    io.on('connection', (socket) => {
        console.log(':: Socket.io: a user connected via spotify.js');
        socket.on('loadSpotify', (id) => {
            console.log('spotify.js: ' + id);

            let guild = client.guilds.cache.get(config.guildId);
            let discordMember = guild.members.cache.get(id);
            update(io, '', discordMember.presence);

        });
    });

}
