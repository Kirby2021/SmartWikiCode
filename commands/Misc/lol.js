const { oneLine } = require("common-tags");
const Discord = require("discord.js");
const moment = require("moment");
const config = require("../../config.json")
const serverflags = {
  DISCORD_EMPLOYEE: `<:DiscordStaff:804197493667004437> \`Discord Employee\``,
  DISCORD_PARTNER: `<a:Discord_Partner:813263800962514945> \`Discord Partner\``,
  BUGHUNTER_LEVEL_1: `<:BugHunter1:802834462780948501> \`Bug Hunter (Level 1)\``,
  BUGHUNTER_LEVEL_2: `<:BugHunter2:802834526065524768> \`Bug Hunter (Level 2)\``,
  HYPESQUAD_EVENTS: `<:HypeEvents:802835049367863296> \`HypeSquad Events\``,
  HOUSE_BRAVERY: `<:Bravery:780277009712283658> \`House of Bravery\``,
  HOUSE_BRILLIANCE: `<:Brilliance:780277050040778770> \`House of Brilliance\``,
  HOUSE_BALANCE: `<:Balance:780276974312095784> \`House of Balance\``,
  EARLY_SUPPORTER: `<:Early:780276943579906048> \`Early Supporter\``,
  TEAM_USER: `\`Team User\``,
  SYSTEM: `\`System\``,
  VERIFIED_BOT: `<:BotCheck:780278191163572254> \`Verified Bot\``,
  VERIFIED_DEVELOPER: `<:Developer:780277148123398215> \`Verified Bot Developer\``,
};
const st = {
  online: "<:online:780276840622587914> Online",
  idle: "<:Idle:802835976477081610> IDLE",
  offline: "<:offline:780400391501250572> Offline",
  dnd: "<:dnd:780276901662687232> Do Not Disturb",
};

module.exports = {
  name: "userinfo",
  description: "Shows the info about an user account",
  category: "utility",
  usage: "info",
  aliases: ["whois", "ui", "checkup"],
  run: async (client, message, args) => {
    const member = await client.findMember(message, args, true);

    const nickname = member.nickname || "*None*";
    const discriminator = member.user.discriminator || "*None*";

    const createdAt = moment.utc(member.user.createdAt).calendar();
    const lp = moment.utc(member.user.createdAt).fromNow();
    const joinedAt = moment.utc(member.joinedAt).calendar();
    const lap = moment.utc(member.joinedAt).fromNow();

    let userFlags = (await member.user.fetchFlags())
      .toArray()
      .map((flag) => serverflags[flag]);
    if (!userFlags || !userFlags.length) userFlags = "*None*";


    const avatar =
      member.user.displayAvatarURL({
        format: "png",
        dynamic: true,
        size: 4096,
      }) || "*None*";

    const bot = member.user.bot ? "Yes" : "No";

    const activities =
      member.user.presence.activities.length === 0
        ? {
            status: "*None*",
            other: [],
          }
        : member.user.presence.activities.reduce(
            (activities, activity) => {
              switch (activity.type) {
                case "CUSTOM_STATUS":
                  activities.status = `${
                    activity.emoji ? `${activity.emoji} | ` : ""
                  }${activity.state}`;
                  break;
                case "PLAYING":
                  activities.other.push(`${activity.type} ${activity.name}`);
                  break;
                case "LISTENING":
                  if (activity.name === "Spotify" && activity.assets) {
                    activities.other.push(
                      `${activity.details} by ${activity.state}`
                    );
                  }
                  break;
                default:
                  activities.other.push(activity.type);
              }

              return activities;
            },
            {
              status: "*None*",
              other: [],
            }
          );

    const roles = member.roles.cache.array().length
      ? member.roles.cache
          .array()
          .filter((role) => role.name !== "@everyone")
          .join(", ")
      : "*None*";
    const highestRole = member.roles.highest || "*None*";
    const hoistRole = member.roles.hoist || "*None*";
    let status = `Disabled This Feature Due To Intents`

    const embed = new Discord.MessageEmbed()
      .setTitle(member.user.tag)
      .setURL(avatar)
      .setThumbnail(avatar)
      .setColor("RANDOM")
      .setFooter(`ID: ${member.user.id}`)
      .setTimestamp()
      .addFields(
        {
          name: "Nickname",
          value: nickname,
          inline: true,
        },
        {
          name: "#️Discriminator",
          value: discriminator,
          inline: true,
        },
        {
          name: "Build",
          value: `${createdAt} | ${lp}`,
          inline: false,
        },
        {
          name: "Joined",
          value: `${joinedAt} | ${lap}`,
          inline: true,
        },
        {
          name: "Badges",
          value: userFlags,
          inline: false,
        },
        {
          name: "Bot",
          value: bot,
          inline: true,
        },
        {
          name: "🥇Highest Role",
          value: highestRole || "None",
          inline: true,
        },
        {
          name: "Hoist Role",
          value: hoistRole || "None",
          inline: true,
        },
        {
          name: ` Roles (${member.roles.cache.size - 1})`,
          value: roles || "None",
          inline: true,
        }
      );

    message.channel.send(embed);
  },
};
