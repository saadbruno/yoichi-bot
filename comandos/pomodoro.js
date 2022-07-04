const config = require("../config.json");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

var pomodoroTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pomodoro')
        .setDescription('Pomodoro!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('iniciar')
                .setDescription('Inicia uma sessão de pomodoro')
                .addIntegerOption(option => option.setName('duração').setDescription('Duração em minutos do bloco de pomodoro. Padrão: 25 minutos'))
                .addIntegerOption(option => option.setName('pausa').setDescription('Duração em minutos da pausa. Padrão: 8 minutos'))
                .addStringOption(option => option.setName('mensagem-de-pausa').setDescription('Opcional: define uma mensagem customizada para o início da pausa'))
                .addStringOption(option => option.setName('mensagem-de-pomodoro').setDescription('Opcional: define uma mensagem customizada para o início do pomodoro')))
        .addSubcommand(subcommand =>
            subcommand
            .setName('parar')
            .setDescription('Encerra o pomodoro')),

        
    async execute(interaction) {

        const canalPomodoro = interaction.guild.channels.cache.get(config.canalPomodoro);
        const subcommand = interaction.options._subcommand;


        // Gerencia o comando de parar o pomodoro
        if(subcommand == "parar") {

            // confere se há uum pomodoro em andamento
            if (!pomodoroTimeout || pomodoroTimeout._destroyed == true) {
                console.log("   :: [Pomodoro] WARN: Usuário solicitou parar o pomodoro, mas não há nenhum pomodoro em andamento.");
                return interaction.reply({ content: 'Não há nenhum pomodoro acontecendo no momento', ephemeral: true }); 
            }

            // confere se o usuário está no canal de voz
            if (!canalPomodoro.members.get(interaction.user.id) && canalPomodoro.members.size != 0) {
                return interaction.reply({ content: `ERRO: Entre no canal de voz <#${config.canalPomodoro}> antes de usar esse comando.`, ephemeral: true });
            }

            const endPomo = new MessageEmbed()
                .setColor('#1e1e1e')
                .setTitle('🍅 Pomodoro encerrado')
                .setTimestamp()
                .setFooter({
                    text: interaction.user.tag, 
                    iconURL: interaction.user.avatarURL()
                });

            clearTimeout(pomodoroTimeout);
            console.log("   :: [Pomodoro] Encerrando pomodoro via comando");
            var mentionList = getMentionList();
            if (mentionList) {
                await canalPomodoro.send({ content: getMentionList(), embeds: [endPomo] });
            } else {
                await canalPomodoro.send({embeds: [endPomo] });
            }
            return interaction.reply({ content: 'Encerrando pomodoro!', ephemeral: true });
        }

        // ======= se chegamos até aqui, o usuário solicitou o início do pomodoro. ====== //

        // confere se ja existe um pomodoro em andamento
        if (pomodoroTimeout && pomodoroTimeout._destroyed == false ) {
            console.log("   :: [Pomodoro] WARN: Usuário tentou iniciar um pomodoro, mas já existe um pomodoro em andamento.");
            return interaction.reply({ content: `Já existe um pomodoro em andamento.\n🍅Caso queira participar, entre no canal de voz <#${config.canalPomodoro}>\n🛑 Caso queira encerrá-lo, use \`/pomodoro parar\``, ephemeral: true }); 
        }

        // confere se o usuário está no canal de voz
        if (!canalPomodoro.members.get(interaction.user.id)) {
            return interaction.reply({ content: `ERRO: Entre no canal de voz <#${config.canalPomodoro}> antes de usar esse comando.`, ephemeral: true });
        }

        var argumentos = {
            "timer": {
                "pomodoro": interaction.options.getInteger('duração') ?? 25,
                "pausa": interaction.options.getInteger('pausa') ?? 8
            },
            "mensagem": {
                "pausa": interaction.options.getString('mensagem-de-pomodoro') ?? "🍅 📝 Fim da pausa, bora trabalhar!",
                "pomodoro": interaction.options.getString('mensagem-de-pausa') ?? "🍅 🥰 Início da pausa para descanso!"
            }
        };

        console.log(
            `\n   :: [Pomodoro] Iniciando pomodoro:`,
            `\n          Pomodoro: ${argumentos.timer.pomodoro}`,
            `\n          Pausa:    ${argumentos.timer.pausa}`,
            `\n          Mensagem de fim de pomodoro: ${argumentos.mensagem.pomodoro}`,
            `\n          Mensagem de fim de pausa:    ${argumentos.mensagem.pausa}`,
            `\n          Usuários no canal de voz:    ${canalPomodoro.members.size}`
        );

        await interaction.reply({ content: `🍅 Iniciando pomodoro em <#${config.canalPomodoro}>`});

        const initPomo = new MessageEmbed()
            .setColor('#f76f68')
            .setTitle('🍅 Iniciando pomodoro!')
            .addFields(
                { name: 'Pomodoro', value: `${argumentos.timer.pomodoro} minutos`, inline: true },
                { name: 'Pausa', value: `${argumentos.timer.pausa} minutos`, inline: true },
                { name: 'Canal de voz', value: `<#${config.canalPomodoro}>` }
            )
            .setTimestamp()
            .setFooter({
                text: interaction.user.tag, 
                iconURL: interaction.user.avatarURL()
            });

        await canalPomodoro.send({ content: getMentionList(), embeds: [initPomo] });

        // função pro timer do pomodoro.
        // Espera o tempo definido no argumento "duração", e então avisa que vai começar a pausa.
        // Depois de 1 minuto, apaga a mensagem da pausa.
        function timerPomodoro(tipo, argumentos) {

            // define o próximo timer
            if (tipo == "pomodoro") {
                var nextTipo = "pausa";
            } else {
                var nextTipo = "pomodoro"
            }

            // inicia timeout com duração do argumento "duração"
            pomodoroTimeout = setTimeout(function () {

                if (canalPomodoro.members.size == 0) {

                    clearTimeout(pomodoroTimeout);
                    console.log("   :: [Pomodoro] Encerrando pomodoro por inatividade");

                    const endPomo = new MessageEmbed().setColor('#1e1e1e').setTitle('🍅 Pomodoro encerrado').setTimestamp();
                    return canalPomodoro.send({embeds: [endPomo] });
                }

                // depois da "duração", envia mensagem de pausa
                canalPomodoro.send(`${argumentos["mensagem"][tipo]}\n${getMentionList()}`)
                    .then(function (msg) {
                        console.log(`   :: [Pomodoro] Mensagem enviada: ${msg.content}`);

                        // depois de 1 minuto, apaga a mensagem
                        setTimeout(function () {
                            msg.delete()
                                .then(msg => console.log(`   :: [Pomodoro] Mensagem removida: ${msg.content}`))
                                .catch(console.error);
                        }, 60000);
                    })
                    .catch(console.error);

                timerPomodoro(nextTipo, argumentos); // inicia o próximo timer   

            }, argumentos["timer"][tipo] * 60000); // tempo do timeout
        };

        // pega a lista de membros no canal de voz do pomodoro, pra mandar os @
        function getMentionList() {
            var userList = '';
            canalPomodoro.members.forEach(function (member) {
                userList += '<@' + member.user.id + '> ';
            });
            return userList;
        }


        // chama o timer pela primeira vez, pra iniciar o loop
        timerPomodoro("pomodoro", argumentos);

    },
};