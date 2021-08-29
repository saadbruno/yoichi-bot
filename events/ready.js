const config = require("../config.json");

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {       
        console.log(`========= YOICHI BOT =========\n:: Logado como ${client.user.tag}\n:: Online em ${client.guilds.cache.size} servidores \n==============================`);

        client.guilds.cache.get(config.guildId).members.fetch().then((members) => {
            console.log(`\n:: Adicionados ${members.size} usuários no cache`);
        });
    },
};