
const pagination = require('discord.js-pagination');
const Discord = require('discord.js');
const config = require('../../../config.json')
module.exports = {
    name: "thelp",
    OwnerOnly: true,
    description: "The help command, what do you expect?",

    async run (client, message, args){

        //Sort your commands into categories, and make seperate embeds for each category

        const moderation = new Discord.MessageEmbed()
        .setTitle('Moderation')
        .addField('`;kick`', 'Kicks a member from your server via mention or ID')
        .addField('`;ban`', 'Bans a member from your server via mention or ID')
        .addField('`;clear`', 'Purges messages')
        .setTimestamp()

        const fun = new Discord.MessageEmbed()
        .setTitle('Fun')
        .addField('`;meme`', 'Generates a random meme')
        .addField('`;ascii`', 'Converts text into ascii')
        .setTimestamp()

        const utility = new Discord.MessageEmbed()
        .setTitle('Utlity')
        .addField('`;global`', 'Track the amount of COVID-19 cases globally')
        .addField('`;country`', 'Tracks a specified country\'s COVID-19 cases')
        .addField('`;ping`', 'Get the bot\'s API ping')
        .addField('`;weather`', 'Checks weather forecast for provided location')
        .setTimestamp()

        const pages = [
                moderation,
                fun,
                utility
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '120000';

        pagination(message, pages, emojiList, timeout)
    }
}