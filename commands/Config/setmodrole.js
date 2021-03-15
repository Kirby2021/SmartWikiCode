const db = require("quick.db");
const config= require("../../config.json")
const emotes = require('../../configs/emotes.json');
module.exports = {
    name: "setmodrole",
    aliases: ["mrole", "setmod"],
    description: "Sets ModRole for this server!",
    usage: "[role name | role mention | role ID]",

  run: async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        "**You Do Not Have The Required Permissions! - [ADMINISTRATOR]**"
      );
    if (!args[0]) {
      let b = await db.fetch(`modrole_${message.guild.id}`);
      let roleName = message.guild.roles.cache.get(b);
      if (message.guild.roles.cache.has(b)) {
        return message.channel.send(
          `**Modrole Set In This Server Is \`${roleName.name}\`!**`
        );
      } else
        return message.channel.send(
          "**Please Enter A Mod Role Name or ID To Set!**"
        );
    }

    let role =
      message.mentions.roles.first() ||
      bot.guilds.cache.get(message.guild.id).roles.cache.get(args[0]) ||
      message.guild.roles.cache.find(
        c => c.name.toLowerCase() === args.join(" ").toLocaleLowerCase()
      );

    if (!role)
      return message.channel.send("**Please Enter A Valid Role Name or ID!**");

    try {
      let a = await db.fetch(`modrole_${message.guild.id}`);

      if (role.id === a) {
        return message.channel.send(
          "**This Role is Already Set As ModRole!**"
        );
      } else {
        db.set(`modrole_${message.guild.id}`, role.id);

        message.channel.send(
          `**\`${role.name}\` Has Been Set Successfully As ModRole!**`
        );
      }
    } catch (err) {
      return message.channel.send(`${emotes.error}Oh No Oh NO oH NO NO NO NO NO.....`).then((msg) => {
          setTimeout(() => {
              msg.edit(`${emotes.error}An Unexpected Error Occured: **${err}** \nRun \`${config.prefix}links\` to join the support server for support`);
          }, 3000)
  })
}
  }
};