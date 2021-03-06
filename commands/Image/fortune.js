const { MessageEmbed } = require('discord.js');
const fortunes = require(`${process.cwd()}/json/fortune.json`);
const config= require("../../config.json")
const emotes = require('../../configs/emotes.json');
module.exports = {
  name: 'fortune',
  aliases: [ 'ft', 'fortunecookies', 'fortunecookie' ],
  group: 'fun',
  description: 'Generate a random fortune',
  clientPermissions: [ 'EMBED_LINKS' ],
  get examples(){ return [ this.name, ...this.aliases]; },
  run: (client, message) => message.channel.send(
    new MessageEmbed()
    .setColor('GREY')
    .setAuthor(message.author.tag)
    .setFooter(`\©️${new Date().getFullYear()} SmartWiki`)
    .setDescription(fortunes[Math.floor(Math.random() * fortunes.length)])
  )
};