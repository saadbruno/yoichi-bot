const config = require("../config.json");
var Airtable = require('airtable');
var base = new Airtable({ apiKey: config.airtableKey }).base(config.airtableBase);
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mondolís')
        .setDescription('Leia Mondolís!')
        .addIntegerOption(option => option.setName('capitulo').setDescription('Escolha um capítulo'))
        .addStringOption(option => option.setName('pagina').setDescription('Escolha uma página')),
    async execute(interaction) {

        var cap = interaction.options.getInteger('capitulo');
        var pag = interaction.options.getString('pagina');

        // se o comando foi utilizado sem argumentos de capitulo e página, manda o link do tapas
        if (!cap && !pag) {
            return interaction.reply({ content: 'Leia Mondolís!\nhttps://tapas.io/series/Mondolis-PTBR/info' });
        }

        // se o comando não temn página, manda o link do capítulo inteiro.
        // no airtable, o link do capitulo inteiro está listado como página "capitulo", então a gente usa essa string
        if (!pag) {
            pag = 'capitulo-inteiro';
        }

        // pega linha no airtable relativa à página e capítulos solicitados
        base('mondolis').select({
            maxRecords: 1,
            view: 'Grid view',
            filterByFormula: `AND({capitulo} = '${cap}', {pagina} = '${pag}', {url} != '') `,
        }).firstPage(function (err, records) {
            if (err) { console.error(err); return; }
            if (!records.length) {
                return interaction.reply({ content: `Não encontrei esse capítulo ou página <${config.emoteBrabo}>`, ephemeral: true });
            }
            records.forEach(function (record) {
                console.log('   :: [Mondolís] Retirado do AirTable:', record.get('url'));

                // se a pagina for o capitulo-inteiro (link do capítulo inteiro), a gente manda só o link
                if (pag == 'capitulo-inteiro') {
                    return interaction.reply({ content: `Mondolís: Capítulo ${cap}\n${record.get('url')}` }); 
                }
                // reply com página e capítulos inteiros
                return interaction.reply({
                    content: `Mondolís: Capítulo ${cap}, Página ${pag}`,
                    files: [record.get('url')]
                })
            });
        });

    },
};