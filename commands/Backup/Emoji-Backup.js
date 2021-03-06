const { random } = require('random-code-gen');
const Discord = require('discord.js');
const db = require("quick.db") 
module.exports = {
	name: 'embackup-create',
	permissions: ['MANAGE_EMOJIS'],
	description: 'create emoji backup of this server',
	run: async (client, message, args) => {
		let code = random(6);
		let bruh = `backups_${message.author.id}`;
		if (!message.channel.permissionsFor(message.member).has('MANAGE_EMOJIS'))
			return message.channel.send(
				':x: | **You dont have permissions to use this command!**'
			);
		let emojis = message.guild.emojis.cache;
		if (emojis.size === 0) {
			let embed = new Discord.MessageEmbed();
			embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
			embed.setDescription(
				`**There are no emojis in this Server to backup.** `
			);
			embed.setFooter(`${message.guild.name}`, message.guild.iconURL())
			embed.setColor('RANDOM');
			embed.setTimestamp();
			return message.channel.send({ embed: embed });
		}
		try {
			message.author.send('Emoji Backup Code: ' + code);
		} catch (err) {
			return message.channel.send(
				':x: | **Unable to dm you, make sure your dms are enabled.**'
			);
		}
		let arr = new Array();
		emojis.forEach(e => arr.push(e.toString()));
		db.push(bruh, {
			code: code,
			server: message.guild.name,
			emojis: arr
		});
		let embed = new Discord.MessageEmbed();
		embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
		embed.setDescription(
			`**The backup has been created, The backup ID has been sent to your dms!**`
		);
		embed.setFooter(`${message.guild.name}`, message.guild.iconURL())
		embed.setColor('GREEN');
		embed.setTimestamp();
		return message.channel.send({ embed: embed });
	}
};
