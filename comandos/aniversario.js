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
            if (err) { console.error(err); return; }
            if (!records.length) {
                return console.log("\n:: [aniversario] Não existem aniversário hoje! :(")
            }
            records.forEach(function (record) {

                console.log(`\n:: [aniversario] Retirado do Airtable: ${record.get('Nome')}, ${record.get('dia')}/${record.get('mes')}`);

                // Dá um fetch na guild pelo usuário. Caso o usuário exista na guild, confere a data do aniversário e age de acordo.
                guild.members.fetch(record.get('Discord ID'))
                    .then(function (member) {
                        // se a pessoa faz aniversário hoje, dá a role e manda parabéns. Se não faz, remove a role
                        if (record.get('dia') == data.hoje.dia) {
                            member.roles.add(role);

                            // se o comando foi executado por um usuário (contém uma mensagem) OU se o primeiro argumento for "post" (por causa do cron), envia a lista de aniversariantes
                            if(message || args[0] == "post") {
                                // formata a mensagem que será enviada
                                var mensagem = `Parabéns <@${record.get('Discord ID')}> <${config.emoteBrabo}>`;
                                // Posta a mensagem no canal determinado anteriormente
                                canalResposta.send(mensagem);
                            }

                        } else {
                            member.roles.remove(role);
                        }
                    })
                    .catch(error => console.error(error));

            });
        });

    },
};