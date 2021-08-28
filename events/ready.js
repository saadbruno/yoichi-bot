module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`========= YOICHI BOT =========\n:: Logado como ${client.user.tag}\n:: Online em ${client.guilds.cache.size} servidores \n==============================`);
    },
};