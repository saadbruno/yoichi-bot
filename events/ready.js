const config = require("../config.json");
const { CronJob } = require("cron");

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {

        // posta mensagem de início 
        console.log(`========= YOICHI BOT =========\n:: Logado como ${client.user.tag}\n:: Online em ${client.guilds.cache.size} servidores \n==============================`);

        let guild = client.guilds.cache.get(config.guildId);

        // adiciona todos usuários ao cache do bit. No momento isso é utilizado no purgerole.
        guild.members.fetch().then((members) => {
            console.log(`\n:: Adicionados ${members.size} usuários no cache`);
        });

        // inicia os cronjobs
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

    },
};