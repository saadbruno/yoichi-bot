const config = require("../config.json");
var Airtable = require('airtable');
var moment = require('moment-timezone');

var base = new Airtable({ apiKey: config.airtableKey }).base(config.airtableBase);
module.exports = {
	name: 'aniversario',
	description: 'aniversario!',
	execute(message, args, client) {

        var canalResposta;

        // Esse copmando pode ser executado via Cron. Nesses casos, não existe um message.channel pra responder, então a gente usa o canal configurado no config.json
        if (message) {
            console.log('\n:: [aniversario] Comando foi enviado por um usuário. Respondendo no canal que o comando foi executado.');
            canalResposta = message.channel;
        } else {
            console.log(`\n:: [aniversario] Comando foi executado via Cron. Postando no canalAniversario (${config.canalAniversario})`);
            canalResposta = client.channels.cache.get(config.canalAniversario);
        }

        // cria variaveis pra data de hoje. Elas são separadas porque fica mais fácil de veriifcar o dia e o mês separado do ano (a gente não liga muito pro ano)
		var dia = moment().tz('America/Sao_Paulo').format("D"); 
        var mes = moment().tz('America/Sao_Paulo').format("M"); 

		base('anivers').select({
            view: 'Grid view',
			 filterByFormula: `AND({dia} = '${dia}', {mes} = '${mes}')`
		
        }).firstPage(function (err, records) {
            if (err) { console.error(err); return; }
            if (!records.length) {
                return console.log("\n:: [aniversario] Não existem aniversário hoje! :(")
            }
            records.forEach(function (record) {

                console.log('\n:: [aniversario] Retirado do Airtable:', record.get('Nome'));
                // formata a mensagem que será enviada
				var mensagem = `Parabéns <@${record.get('Discord ID')}> <${config.emoteBrabo}>`;
                // escolhe onde a mensagem será postada
                canalResposta.send(mensagem);

            });
        });
	},
};