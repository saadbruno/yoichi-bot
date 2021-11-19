const config = require("../config.json");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pomodoro')
        .setDescription('Inicia uma sessão de pomodoro')
        .addIntegerOption(option => option.setName('duração').setDescription('Duração em minutos do bloco de pomodoro. Padrão: 25 minutos'))
        .addIntegerOption(option => option.setName('pausa').setDescription('Duração em minutos da pausa. Padrão: 8 minutos'))
        .addStringOption(option => option.setName('mensagem-de-pausa').setDescription('Opcional: define uma mensagem customizada para o início da pausa'))
        .addStringOption(option => option.setName('mensagem-de-pomodoro').setDescription('Opcional: define uma mensagem customizada para o início do pomodoro')),
        
    async execute(interaction) {

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

        var canalTextoPomodoro = interaction.guild.channels.cache.get(config.textoPomodoro);
        var canalVozPomodoro = interaction.guild.channels.cache.get(config.vozPomodoro)

        console.log(
            `\n   :: [Pomodoro] Iniciando pomodoro:`,
            `\n          Pomodoro: ${argumentos.timer.pomodoro}`,
            `\n          Pausa:    ${argumentos.timer.pausa}`,
            `\n          Mensagem de fim de pomodoro: ${argumentos.mensagem.pomodoro}`,
            `\n          Mensagem de fim de pausa:    ${argumentos.mensagem.pausa}`,
            `\n          Usuários no canal de voz:    ${canalVozPomodoro.members.size}`
        );

        await interaction.reply({ content: `🍅 Iniciando pomodoro em <#${config.textoPomodoro}>`, ephemeral: true });

        const initPomo = new MessageEmbed()
            .setColor('#f76f68')
            .setTitle('🍅 Iniciando pomodoro!')
            .addFields(
                { name: 'Pomodoro', value: `${argumentos.timer.pomodoro} minutos`, inline: true },
                { name: 'Pausa', value: `${argumentos.timer.pausa} minutos`, inline: true },
                { name: 'Canal de voz', value: `<#${config.vozPomodoro}>` }
            )
            .setTimestamp()
            .setFooter(interaction.user.tag, interaction.user.avatarURL());

        await canalTextoPomodoro.send({ content: getMentionList(), embeds: [initPomo] });

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
            setTimeout(function () {

                // depois da "duração", envia mensagem de pausa
                canalTextoPomodoro.send(`${argumentos["mensagem"][tipo]}\n${getMentionList()}`)
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
            canalVozPomodoro.members.forEach(function (member) {
                userList += '<@' + member.user.id + '> ';
            });
            return userList;
        }


        // chama o timer pela primeira vez, pra iniciar o loop
        timerPomodoro("pomodoro", argumentos);

    },
};