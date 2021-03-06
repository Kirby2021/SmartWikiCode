const Discord = require("discord.js")
const { dev } = require('../../config.json');

module.exports = {
  name: "embed",
  description: "admin only make embed command",
  aliases: ['make-embed'],
    run: async (client, message, args) => {
    		if (
			!message.member.hasPermission('ADMINISTRATOR') &&
			!dev.includes(message.author.id)
		)
			return message.channel.send(
				'You Do Not Have The Required Permissions! - [ADMINISTRATOR]'
			);
    const embed = null
    const channel = message.mentions.channels.first(); // Take first channel mention from the message
    if (!channel) return message.channel.send('Specify a channel to send embed!')
    args.shift(); // Shifting argument because args[0] is channel mention!
    const arg = args.join(" "); // Joining args to split it by '^' Symbol!
    const title = arg.split('^')[0];
    if (!title) return message.channel.send('Specify a title for the embed!')
    const description = arg.split('^')[1];
    if (!description) return message.channel.send('Specify a description for the embed!')
    const footer = arg.split('^')[2];
    if (!footer) return message.channel.send('Specify a footer for the embed!')

    // As Color, Thumbnail and Image is optional, We check if the user has specified it and make our move.

    const color = `#${arg.split('^')[3]}`
    const thumbnail = arg.split('^')[4]
    const image = arg.split('^')[5]

    if (![color, thumbnail, image]) {
      let embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .setFooter(footer);
      channel.send(embed);
    } else if (![thumbnail, image]) {
      let embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .setFooter(footer)
      .setColor(color);
      channel.send(embed);
    } else if (!image) {
      let embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .setFooter(footer)
      .setColor(color)
      .setThumbnail(thumbnail);
      channel.send(embed);
    } else if ([color, thumbnail, image]) {
      let embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .setFooter(footer)
      .setColor(color)
      .setThumbnail(thumbnail)
      .setImage(image);
      channel.send(embed);
    }
  }
}