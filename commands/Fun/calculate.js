
const Discord = require('discord.js');
const math = require('mathjs');
const config= require("../../config.json")
const emotes = require('../../configs/emotes.json');
module.exports = {
        name: "calculate",
        group: "utility",
        aliases: ['calc', 'calculator'],
        description: "Shows Calculated Answers Of User's Query",
        usage: "[query](mathematical)",
        accessableby: "everyone",
    run: async (bot, message, args) => {
        try{
        if (!args[0]) return message.channel.send("**Enter Something To Calculate**");

        let result;
        try {
            result = math.evaluate(args.join(" ").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/"));
        } catch (e) {
            return message.channel.send("**Enter Valid Calculation!**\n\n**List of Calculations** - \n1. **sqrt equation** - `sqrt(3^2 + 4^2) = 5`\n2. **Units to Units** - `2 inch to cm = 0.58`\n3. **Complex Expressions Like** - `cos(45 deg) = 0.7071067811865476`\n4. **Basic Maths Expressions** - `+, -, ^, /, decimals` = **2.5 - 2 = 0.5**");
        }

        let embed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`${bot.user.username} Calculator`, message.author.displayAvatarURL({ dynamic: true }))
            .addField("**Operation**", `\`\`\`Js\n${args.join("").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/")}\`\`\``)
            .addField("**Result**", `\`\`\`Js\n${result}\`\`\``)
            .setFooter(message.guild.name, message.guild.iconURL());
        message.channel.send(embed)

    } catch (err) {
        return message.channel.send(`${emotes.error}Oh No Oh NO oH NO NO NO NO NO.....`).then((msg) => {
            setTimeout(() => {
                msg.edit(`${emotes.error}An Unexpected Error Occured: **${err}** \nRun \`${config.prefix}links\` to join the support server for support`);
            }, 3000)
    })
}
    }
}