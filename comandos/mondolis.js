const config = require("../config.json");
var Airtable = require('airtable');

var Airtable = require('airtable');
var base = new Airtable({ apiKey: config.airtableKey }).base(config.airtableBase);

module.exports = {
	name: 'mondolis',
	description: 'Posta o link de Mondolís no Tapas',
	execute(message, args) {

		// se o usuário não incluiu nenhuma página, apenas posta o link do tapas
		if (!args.length) {
			return message.channel.send('Leia Mondolís!\nhttps://tapas.io/series/Mondolis-PTBR/info');
		}

		// o usuário também pode pedir uma pagina específica, que bisca numa planilha do AirTable

		// vamos primeiro formatar os argumentos considerando diversos inputs diferentes do usuário
		// exemplo: !mondolis c 1 p 2
		//			!mondolis cap 1 pag 2
		//			!mondolis capitulo 1 pagina 2
		// Todos esses comandos devem funcioanr igualmente

		// pagCap é o objeto que contém o número do capítulo e da página que o usuário enviou, e será usado pra buscar a página no Airtable.
		// o formato final do pagCap deve ser {"c": "X", "p": "Y"}, onde X e Y são números
		var pagCap = {};

		// caso o primeiro argumento seja tudo junto, tipo c1p2 ou c2p30
		if (/c([0-9]+)p([0-9]+)/i.test(args[0])) {
			const cpSplit = args[0].split(/c|p/);
			pagCap = {
				"c": cpSplit[1],
				"p": cpSplit[2]
			};
		} else {

		// argumento não foi tudo junto. Deve ser separado então. Vamos padronizar "cap", "capítulo", "pag", "página", etc
			for (var i = 0; i < args.length; i++) {
				switch (args[i].toLowerCase()) {
					case 'capitulo':
					case 'capítulo':
					case 'cap':
						args[i] = 'c';
						break;

					case 'página':
					case 'pagina':
					case 'pág':
					case 'pag':
						args[i] = 'p';
						break;

					default:
						break;
				}
			}

			// agora vamos associar o número enviado ao lado de cada um dos argumentos (página e capítulo)
			for (let i = 0; i < args.length; i++) {
				if (args[i] == 'p' || args[i] == 'c') {
					const j = i + 1;
					pagCap[args[i]] = args[j];
				}
			}

		}

		// Verifica se temos argumentos c e p
		if (!pagCap.c || !pagCap.p) {
			console.error(`\n\n:: Faltando argumentos de capítulo ou página`)
			return message.channel.send(`Defina uma página e capítulo, tipo \`!mondolis cap 3 pag 1\` <${config.emoteBrabo}>`);
		}

		// pega linha no airtable relativa à página e capítulos solicitados
		base('mondolis').select({
			maxRecords: 1,
			view: 'Grid view',
			filterByFormula: `AND({capitulo} = '${pagCap.c}', {pagina} = '${pagCap.p}', {url} != '') `,
		}).firstPage(function (err, records) {
			if (err) { console.error(err); return; }
			if (!records.length) {
				return message.channel.send(`Não encontrei essa página <${config.emoteBrabo}>`);
			}
			records.forEach(function (record) {
				console.log('\n:: Retrieved', record.get('url'));
				message.channel.send(`Mondolís: Capítulo ${pagCap.c}, Página ${pagCap.p}\n${record.get('url')}`)
			});
		});


	},
};