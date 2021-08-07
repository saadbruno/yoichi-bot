module.exports = {
    name: 'sub',
    aliases: ['twitch', 'twitchsub', 'subscriber', 'inscrito', 'inscritos'],
    description: 'Descreve como conectar a twitch ao discord!',
    execute(message, args) {

        message.channel.send("Se você é **sub na Twitch** e quiser acesso ao **canal exclusivo dos subs** <#800060933170659359>, lembre-se de conectar sua Twitch à sua conta do Discord! \n*(Após realizar a conexão, pode levar até 1 hora pro Discord sincronizar os cargos)*", {files: ["https://cdn.discordapp.com/attachments/770002916374478869/873352673510977536/twitch-sub-role.png"]});
    },
};