module.exports = {
	name: 'ping',
	aliases: ['teste'],
	description: 'Ping!',
	execute(message, args) {
		message.channel.send('Pong!');
	},
};