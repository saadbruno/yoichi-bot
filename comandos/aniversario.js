const config = require("../config.json");
var moment = require('moment-timezone');
var Airtable = require('airtable');
var base = new Airtable({ apiKey: config.airtableKey }).base(config.airtableBase);
const { SlashCommandBuilder } = require('@discordjs/builders');

// - pega aniversariantes de ontem e hoje no airtable
// - separa eles em 2 arrays
// - confere se eles tão no discord
// - dá a role pros hojeversarios
// - remove role dos ontemversarios
// - reply com os hojeversarios

module.exports = {
    data: new SlashCommandBuilder()
        .setName('aniversário')
        .setDescription('Dá os parabéns ao(s) aniversariante(s) do dia!'),
    async execute(interaction) {

        // Cria um objeto com a role de aniversariante. A gente vai adicionar essa role pra quem faz aniversário hoje, e remove a role pra quem fez aniversário ontem
        var guild = interaction.client.guilds.cache.get(config.guildAniversario);
        let role = guild.roles.cache.find(r => r.id === config.roleAniversario);

        // cria variaveis pra data de hoje e ontem. Elas são separadas porque fica mais fácil de veriifcar o dia e o mês separado do ano (a gente não liga muito pro ano)
        // a gente pega a data de ontem também pra tirar a Role de quem fez aniversário ontem
        let dates = getDates();

        console.log(`   :: [aniversario] Usando datas:`, dates);

        // pega os aniversariantes do airtable;
        const aniversariantes = await getAniversariantes(dates);
        console.log("   aniversariantes", aniversariantes);

        const checkedMembers = await checkMembers(aniversariantes, guild);
        // console.log(checkedMembers);

        manageRoles(role, checkedMembers);
        replyToInteraction(interaction, checkedMembers);
    },
};

// =======
// funções
// =======

// função pra criar array com as datas de ontem e hoje usando o moment
function getDates() {
    var dates = {
        "hoje": {
            "dia": moment().tz('America/Sao_Paulo').format("D"),
            "mes": moment().tz('America/Sao_Paulo').format("M")
        },
        "ontem": {
            "dia": moment().tz('America/Sao_Paulo').subtract(1, 'days').format("D"),
            "mes": moment().tz('America/Sao_Paulo').subtract(1, 'days').format("M")
        }
    };
    return dates;
}

// função q pega os aniversariantes de ontem e hoje no airtable
// baseado em https://gist.github.com/zejacobi/89cad7114b66afa4aea458b81a47fbad
// e // https://stackoverflow.com/a/64858588
async function getAniversariantes(dates) {
    // cria promise pra conseguir rodar esse trecho em async
    return new Promise((resolve, reject) => {

        // cria array q será retornado ao final da função
        var aniversariantes = [];

        base('anivers').select({
            filterByFormula: `OR(AND({dia} = '${dates.hoje.dia}', {mes} = '${dates.hoje.mes}'), AND({dia} = '${dates.ontem.dia}', {mes} = '${dates.ontem.mes}'))`
        }).eachPage(function page(records, fetchNextPage) {
            records.forEach(function (record) {

                // define se o aniversariante é de hoje ou ontem (pra adicionar / remover a role)
                var dia = 'hoje';
                if (record.get('dia') == dates.ontem.dia) {
                    dia = 'ontem';
                }

                // bota o aniversariante no array
                aniversariantes.push({ "nome": record.get('Nome'), "id": record.get('Discord ID'), "dia": dia });

            });
            fetchNextPage();
        }, function done(err) {
            if (err) { console.error(err); return reject({}); }
            // console.log(aniversariantes);
            // retorna o array
            resolve(aniversariantes);
        });
    });
}


// função que confere se os aniversariantes fazem parte da guild no discord, e já separa eles entre 2 arrays, ontem e hoje
async function checkMembers(aniversariantes, guild) {

    // cria o array q será retornado ao final
    var checkedMembers = { "hoje": [], "ontem": [] };

    // cria o loop
    const promises = aniversariantes.map(async (member) => {
        const discordMember = await guild.members.fetch(member.id).catch(error => console.error(`   :: [aniversário] WARN: Usuário ${member.nome} com ID ${member.id} não encontrado.`));

        if (!discordMember) return;

        if (member.dia == "hoje") {
            checkedMembers.hoje.push(discordMember);
        } else {
            checkedMembers.ontem.push(discordMember);
        }

    });

    // roda o loop em async e retorna
    await Promise.all(promises);
    return checkedMembers;

}

// função que pega a lista de usuários (ja organizada pela função checkMembers) e adiciona / remove as roles
function manageRoles(role, members) {
    members.hoje.forEach(member => {
        console.log(`   :: [aniversario] ${member.user.tag} - Adicionando role ${role.name}`)
        member.roles.add(role)
            .catch(error => console.error(`   :: [aniversario] ERRO: Não foi possivel adicionar a role ${role.name} ao usuário ${member.user.tag}. O bot tem permissão pra fazer isso?\n\n`, error));
    });

    members.ontem.forEach(member => {
        console.log(`   :: [aniversario] ${member.user.tag} - Removendo role ${role.name}`)
        member.roles.remove(role)
            .catch(error => console.error(`   :: [aniversario] ERRO: Não foi possivel adicionar a role ${role.name} ao usuário ${member.user.tag}. O bot tem permissão pra fazer isso?\n\n`, error));
    });

}

// função pra responder à interação do usuário q iniciou o comando
async function replyToInteraction(interaction, members){

    if (members.hoje.length === 0) {
        return interaction.reply({content: "Ninguém faz aniversário hoje!", ephemeral: true});
    }

    let reply = "Parabéns";
    members.hoje.forEach(member => {
        reply += ` <@${member.id}>`;
    });
    reply +=` <${config.emoteBrabo}>`;

    return interaction.reply({content: reply});

}
