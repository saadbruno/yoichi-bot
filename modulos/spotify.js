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
        io.to(newPresence.userId).emit('spotify', 'pause'); // envia pause pra sala específica do userId
        return;
    }

    // Debug: Caso haja dados do Spotify, mostra no console.
    // console.log(`
    //     User ID: ${newPresence.userId}
    //     Artist:  ${spotify.state}
    //     Song:    ${spotify.details}
    //     Album:   ${spotify.assets.largeText}
    //     Cover:   https://i.scdn.co/image/${spotify.assets.largeImage.slice(8)}
    // `);
    // console.log(spotify);

    // ======= Envia dados do spotify pro overlay =======
    // ==================================================
    // Quando a gente carrega o overlay pela primeira vez, com loadSpotify (dentro do module.exports ali em baixo),
    // a gente chama a função update() com o `socket` específico da nova conexão, em vez do `io` como um todo.
    // O motivo disso é que quando um cliente novo se conecta, a gente só quer enviar as informações pra esse cliente em específico, e não para todos
    // os clientes conectados. 
    // Esse condicional checa por `io.id`, porque quando é uma conexão socket específica (unico cliente), o objeto possui um id, quue é o ID da conexão.
    // Assim a gente consegue saber se é um cliente novo requuisitando os dados, ou se estamos enviando uma atualização pra todo mundo.
    if (io.id) {
        io.emit('spotify', spotify); // seria o equivalente, nesse caso a socket.emit() -> envia para o cliente socket específico
    } else {
        io.to(newPresence.userId).emit('spotify', spotify); // envia dados pra todo mundo que pertence a sala específica do userId
    }
}

module.exports = function (io, client) {

    // quando discord deteca atualização do Rich Presence, a gente chama a função update.
    // Aqui a gente envia os dados pra todos os clientes conectados (que pertencem ao grupo do id do discord) -> nesse caso a gente chama o update() com o `io`
    client.on('presenceUpdate', (...args) => update(io, ...args));

    // qunado a página é aberta pela primeira vez, a gente pega a presença pelo cache do discord
    // Aqui a gente envia os dados só para o novo cliente conectado -> nesse caso a gente chama o update() com o `socket`, que é essa conexão em específico
    io.on('connection', (socket) => {
        console.log(':: Socket.io: a user connected via spotify.js');
        socket.on('loadSpotify', (id) => {
            console.log('spotify.js: ' + id);
            socket.join(id); // adiciona a conexão atual a uma sala do socket. Essa sala será usada pra emissão dos dados quanto troca musica, etc

            let guild = client.guilds.cache.get(config.guildId);
            let discordMember = guild.members.cache.get(id);
            if (discordMember) { // se o ID for válido, discordMember existe. Só enviamos o update nesse caso
                update(socket, '', discordMember.presence);
            }
        });
    });

}
