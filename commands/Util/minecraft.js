const Color = "GREY", Fetch = require("node-fetch").default; //npm i node-fetch
const Discord = require('discord.js')
const config= require("../../config.json")
const emotes = require('../../configs/emotes.json');
module.exports = {
  name: "minecraft",
  aliases: ["mcserver", "mcs"],
  category: "Information",
  group: "utility",
  description: "Show Minecraft Server Information!",
  usage: "Minecraftserver <Ip>",
  run: async (client, message, args) => {
    try{
    const Ip = args[0];
    if (!Ip) return message.channel.send("Please Give Minecraft Java Server IP!");

    const response = await Fetch(`https://api.mcsrvstat.us/2/${Ip}`);
    const json = await response.json();

    if (!json.online) return messsage.channel.send("Invalid Server IP Or Server Is Offline");

    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle((json.hostname || Ip) + " Information")
    .setThumbnail(`https://eu.mc-api.net/v3/server/favicon/${Ip.toLowerCase()}`)
    .addField("IP", json.ip || "Unknown", true)
    .addField("Port", json.port || "Default", true)
    .addField("Status", json.online ? "Online" : "Offline")
    .addField("Version", json.version || "Unknown")
    .addField("Players", json.players ? json.players.online : "Unknown")
    .addField("Max Players", json.players ? json.players.max : "Unknown")
    .setFooter(`Minecraft | \©️${new Date().getFullYear()} SmartWiki`)
    .setTimestamp();
    
    if (json.motd && json.motd.clean && json.motd.clean.length > 1) Embed.addField("Description", json.motd.clean.length > 100 ? `${json.motd.clean.slice(0, 100)}...` : json.motd.clean);

    return message.channel.send(Embed)
  } catch (err) {
    return message.channel.send(`${emotes.error}Oh No Oh NO oH NO NO NO NO NO.....`).then((msg) => {
        setTimeout(() => {
            msg.edit(`${emotes.error}An Unexpected Error Occured: **${err}** \nRun \`${config.prefix}links\` to join the support server for support`);
        }, 3000)
})
}
  }
};