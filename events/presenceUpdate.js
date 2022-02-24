// Esse script pega as atualizações de Presence do Discord.
// Por enquanto, é só usado para atualizações do Spotify

module.exports = {
    name: 'presenceUpdate',
    execute(oldPresence, newPresence) {
        console.log(`\n:: Nova atualização de Presence`);

        // encontra, entre todas as atividades, o Spotify
        let spotify = newPresence.activities.find(function (item) {
            return item.name === 'Spotify';
        });

        // se não tiver Spotify entre as atividades, cancela execução
        if (!spotify) {
            console.log(`Sem Spotify entre as atividades.`);
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
        
    },
};