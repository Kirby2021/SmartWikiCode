const emojiArray = require("../../utils/optionArray");
const pollModel = require("../../models/poll");
const squigglyRegex = RegExp(/"(.*?)"/);
const squareRegex = RegExp(/\[[^[]+\]/g);
const timeRegex = RegExp(/"(\d+(s|m|h|d|w))"/);
const moment = require("moment");
const ms = require("ms");

module.exports = {
  name: "poll",
  description: "Create a poll with ease!",
  category: "utility",
  run: async (client, message, args) => {
    const pollParameters = args.join(" ");
    const pollTitle = squigglyRegex.test(pollParameters)
      ? squigglyRegex.exec(pollParameters)[0]
      : null;

const e = `"`
    if (!pollTitle) {
      return message.channel
        .send(
          `You need to specify a poll title! EX: s!poll ${e}title${e} ${e}time${e} [option 1] [option 2] [You can add up to 10 options]`
        )
        .catch((err) => console.log(err));
    }

    pollParameters.replace(`{${pollTitle}}`, "");
    const pollsArray = pollParameters.match(squareRegex);

    if (!pollsArray) {
      return message.channel
                    .send(
          `You need to specify poll options!  EX: s!poll ${e}title${e} ${e}time${e} [option 1] [option 2] [You can add up to 10 options]`
        )
        .catch((err) => console.log(err));
    } else if (pollsArray.length > 10) {
      return message.channel
        .send(
          `You can't have more than 10 poll options.  EX: s!poll ${e}title${e} ${e}time${e} [option 1] [option 2] [You can add up to 10 options]` 
        )
        .catch((err) => console.log(err));
    }

    let i = 0;
    const pollString = pollsArray
      .map((poll) => `${emojiArray()[i++]} ${poll.replace(/\[|\]/g, "")}`)
      .join("\n\n");
    const timedPoll = timeRegex.test(args[1])
      ? timeRegex.exec(args[1])[1]
      : null;

    const embed = {
      color: "BLUE",
      title: pollTitle,
      description: pollString,
      footer: {
        text: timedPoll
          ? `Ends at: ${moment(Date.now() + ms(timedPoll)).format("LLLL")}`
          : "",
      },
    };

    const msg = await message.channel
      .send({ embed: embed })
      .catch((err) => console.log(err));

    if (timedPoll) {
      const pollDoc = new pollModel({
        guild: message.guild.id,
        textChannel: message.channel.id,
        message: msg.id,
        expiryDate: Date.now() + ms(timedPoll),
      });

      await pollDoc.save().catch((err) => console.log(err));
    }

    for (i = 0; i < pollsArray.length; i++) {
      await msg.react(emojiArray()[i]).catch((err) => console.log(err));
    }
  },
};