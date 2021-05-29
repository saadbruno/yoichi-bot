const config = require("../config.json");
var Airtable = require('airtable');
var moment = require('moment-timezone');

var base = new Airtable({ apiKey: config.airtableKey }).base(config.airtableBase);
module.exports = {
	name: 'aniversario',
	description: 'aniversario!',
	execute(message, args, client) {
		var dia = moment().tz('America/Sao_Paulo').format("D"); 
        var mes = moment().tz('America/Sao_Paulo').format("M"); 
        var ano = moment().tz('America/Sao_Paulo').format("YYYY");

		base('anivers').select({
            view: 'Grid view',
			 filterByFormula: `AND({dia} = '${dia}', {mes} = '${mes}')`
		
        }).firstPage(function (err, records) {
            if (err) { console.error(err); return; }
            if (!records.length) {
                return message.channel.send(`Não encontrei essa página <${config.emoteBrabo}>`);
            }
            records.forEach(function (record) {

				var mensagem = `Parabéns <@${record.get('Discord ID')}> <${config.emoteBrabo}>`;

                console.log('\n:: Retrieved', record.get('dia'));
				const cronChannel = client.channels.cache.get(config.canalAniversario);

				cronChannel.send(mensagem)
            });
        });
	},
};