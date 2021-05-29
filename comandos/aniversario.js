const config = require("../config.json");
var moment = require('moment-timezone');
var Airtable = require('airtable');
var base = new Airtable({ apiKey: config.airtableKey }).base(config.airtableBase);

module.exports = {
    name: 'aniversario',
    description: 'aniversario!',
    execute(message, args, client) {

        // Esse copmando pode ser executado via Cron. Nesses casos, não existe um message.channel pra responder, então a gente usa o canal configurado no config.json
        var canalResposta;
        if (message) {
            console.log('\n:: [aniversario] Comando foi enviado por um usuário. Respondendo no canal que o comando foi executado.');
            canalResposta = message.channel;
        } else {
            console.log(`\n:: [aniversario] Comando foi executado via Cron. Postando no canalAniversario (${config.canalAniversario})`);
            canalResposta = client.channels.cache.get(config.canalAniversario);
        }

        // Cria um objeto com a role de aniversariante. A gente vai adicionar essa role pra quem faz aniversário hoje, e remove a role pra quem fez aniversário ontem
        var guild = client.guilds.cache.get(config.guildAniversario);
        let role = guild.roles.cache.find(r => r.id === config.roleAniversario);

        // cria variaveis pra data de hoje e ontem. Elas são separadas porque fica mais fácil de veriifcar o dia e o mês separado do ano (a gente não liga muito pro ano)
        // a gente pega a data de ontem também pra tirar a Role de quem fez aniversário ontem
        var data = {
            "hoje": {
                "dia": moment().tz('America/Sao_Paulo').format("D"),
                "mes": moment().tz('America/Sao_Paulo').format("M")
            },
            "ontem": {
                "dia": moment().tz('America/Sao_Paulo').subtract(1, 'days').format("D"),
                "mes": moment().tz('America/Sao_Paulo').subtract(1, 'days').format("M")
            }
        };

        console.log(`:: [aniversario] Usando datas:`);
        console.log(data);

        base('anivers').select({
            view: 'Grid view',
            filterByFormula: `OR(AND({dia} = '${data.hoje.dia}', {mes} = '${data.hoje.mes}'), AND({dia} = '${data.ontem.dia}', {mes} = '${data.ontem.mes}'))`
        }).firstPage(function (err, records) {
            if (err) { return console.error(err); }
            if (!records.length) { return console.log("\n:: [aniversario] Não existem aniversários hoje, nem ontem! :(") }

            records.forEach(function (record) {
                console.log(`:: [aniversario] Retirado do Airtable: ${record.get('Nome')}, ${record.get('dia')}/${record.get('mes')}`);
                // Dá um fetch na guild pelo usuário. Caso o usuário exista na guild, confere a data do aniversário e age de acordo.
                guild.members.fetch(record.get('Discord ID'))
                    .then(function (member) {
                       return aniversariante(member, record.get('dia'));
                    })
                    .catch(error => console.error(error));
            });
        });

        // Função que gerencia as roles de aniversário, e decide se envia mensagem no canal
        function aniversariante(member, dia) {
            // se a pessoa não faz aniversario hoje, remove a role e termina execução
            if (dia != data.hoje.dia) {
                console.log(`:: [aniversario] ${member.user.username} não faz aniversário hoje. Removendo a role ${role.name}`);
                return member.roles.remove(role);
            }

            console.log(`:: [aniversario] ${member.user.username} - Adicionando role ${role.name}`)
            member.roles.add(role);
            //se o comando foi executado por um usuário (contém uma mensagem) OU se o primeiro argumento for "post" (por causa do cron), envia a lista de aniversariantes
            if(message || args[0] == "post") {
                // formata e envia a mensagem que será enviada
                var mensagem = `Parabéns <@${member.user.id}> <${config.emoteBrabo}>`;
                canalResposta.send(mensagem);
            }
        }

    },
};