// Comando que remove todos os usuários (em cache) de uma role específica, do servidor configurado no config.json
// Limitações: No momento, o bot só remove as roles dos usuários que estão em cache.
// É possível pegar todos os usuários de um servidor, mas não todos os usuários de uma role específica. E eu não sei se eu quero fazer isso
// https://discord.js.org/#/docs/main/stable/class/GuildMemberManager?scrollTo=fetch

const config = require("../config.json");

module.exports = {
    name: 'purgerole',
    description: 'Remove todos os usuários de uma role específica.',
    execute(message, args, client) {

        // se a mensagem veio de um usuário, veja se ele é autorizado
        if (message && !(config.servidoresAutorizados.includes(message.channel.guild.id) && message.member.hasPermission('ADMINISTRATOR'))) {
            console.log('\n\n:: [purgerole]: Usuário sem permissão executou o comando. Abortando.');
            return;
        }

        var guild = client.guilds.cache.get(config.guildAniversario);
        let role = guild.roles.cache.find(r => r.id === args[0]);

        console.log(`:: [purgerole] A role "${role.name}" possui ${role.members.size} membros no cache.`);

        role.members.forEach(member => {
            console.log(`:: [purgerole] Removendo role ${role.name} do usuário ${member.user.username}#${member.user.discriminator}`);
            member.roles.remove(role)
                .catch(error => console.error(`\n:: [purgerole] ERRO: Não foi possivel remover a role ${role.name} do usuário ${member.user.username}#${member.user.discriminator}. O bot tem permissão pra fazer isso?\n\n`, error));
        });

    },
};