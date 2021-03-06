const covidModel = require("../models/covid");
const { MessageEmbed } = require("discord.js");
const covid = require("covidtracker");
module.exports = async (client, id) => {
  const covidm = await covidModel.findOne({ guild: id }).catch(() => {})
  const ch = covidm?.channelID;
  const en = covidm?.enabled;
  if (!en || en === false) return;
  if (!ch) return;
  const channel = await client.channels.fetch(ch).catch(() => {})
  if (channel && en) {
    const totalStats = await covid.getAll();

    const updatedTime = new Date(totalStats.updated);

   const embed = new MessageEmbed()
      .setAuthor("Coronavirus Stats", client.user.displayAvatarURL())
      .addField(
        "Confirmed Cases",
        `**${totalStats.cases.toLocaleString()}**`,
        true
      )
      .addField(
        "Today Cases",
        `+${totalStats.todayCases.toLocaleString()}`,
        true
      )
      .addField(
        "Today Deaths",
        `+${totalStats.todayDeaths.toLocaleString()}`,
        true
      )
      .addField(
        "Active",
        `${totalStats.active.toLocaleString()} (${(
          (totalStats.active / totalStats.cases) *
          100
        ).toFixed(2)}%)`,
        true
      )
      .addField(
        "Recovered",
        `${totalStats.recovered.toLocaleString()} (${(
          (totalStats.recovered / totalStats.cases) *
          100
        ).toFixed(2)}%)`,
        true
      )
      .addField(
        "Deaths",
        `${totalStats.deaths.toLocaleString()} (${(
          (totalStats.deaths / totalStats.cases) *
          100
        ).toFixed(2)}%)`,
        true
      )
      .addField("Tests", `${totalStats.tests.toLocaleString()}`, true)
      .addField(
        "Cases Per Mil",
        `${totalStats.casesPerOneMillion.toLocaleString()}`,
        true
      )
      .addField(
        "Deaths Per Mil",
        `${totalStats.deathsPerOneMillion.toLocaleString()}`,
        true
      )
      .setImage(
        `https://xtrading.io/static/layouts/qK98Z47ptC-embed.png?newest=${Date.now()}`
      )
      .setColor("RANDOM")
      .setFooter(`AutoCovid By SmartWiki`);
    client.channels.cache.get(ch).send(embed).catch(() => {})
  } else {
    return;
  }
};