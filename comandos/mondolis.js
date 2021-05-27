module.exports = {
	name: 'mondolis',
	description: 'Posta o link de Mondolís no Tapas',
	execute(message, args) {
		message.channel.send('Leia Mondolís!\nhttps://tapas.io/series/Mondolis-PTBR/info');
	},
};