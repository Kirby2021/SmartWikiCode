const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');
const fetch = require('node-fetch');
const text = require(`${process.cwd()}/utils/string`)
const config= require("../../config.json")
const emotes = require('../../configs/emotes.json');
  
   module.exports = {
  name: 'eval',
  aliases: [],
  OwnerOnly: true,
  description: 'Evaluate arbitrary Javascript',
  run: async (client, message, args) => {
     
    if(!config.dev.includes(message.author.id)) return;
      try{
      const code = args.join(' ');
      if(!code) return message.reply(`${emotes.error} || Please give me a query to eval!`);
      let evaled = eval(code);
      let raw = evaled;
      let promise, output, bin, download, type, color;

      if (evaled instanceof Promise){
        message.channel.startTyping();
        promise = await evaled
        .then(res => { return { resolved: true, body: inspect(res, { depth: 0 })};})
        .catch(err => { return { rejected: true, body: inspect(err, { depth: 0 })};});
      };

      if (typeof evaled !== 'string'){
        evaled = inspect(evaled, { depth: 0 });
      };

      if (promise){
        output = text.clean(promise.body)
      } else {
        output = text.clean(evaled)
      };

      if (promise?.resolved){
        color = 'GREEN'
        type = 'Promise (Resolved)'
      } else if (promise?.rejected){
        color = 'RED'
        type = 'Promise (Rejected)'
      } else {
        color = 'GREY'
        type = (typeof raw).charAt(0).toUpperCase() + (typeof raw).slice(1)
      };

      const elapsed = Math.abs(Date.now() - message.createdTimestamp);
      const embed = new MessageEmbed()
      .setColor(color)
      .addField('\\📥 Input',`\`\`\`js\n${text.truncate(text.clean(code),1000)}\`\`\``)
      .setFooter([
        `Type: ${type}`,
        `Evaluated in ${elapsed}ms.`,
        `\©️${new Date().getFullYear()} SmartWiki`].join('\u2000•\u2000')
      );

      if (output.length > 1000){
        await fetch('https://hastebin.com/documents', {
          method: 'POST',
          body: output,
          headers: { 'Content-Type': 'text/plain' }
        }).then(res => res.json())
        .then(json => bin = 'https://hastebin.com/' + json.key + '.js')
        .catch(() => null)

        if (client.config.channels.uploads){
          await client.channels.cache.get(client.config.channels.uploads)
          .send({ files: [{ attachment: Buffer.from(output), name: 'evaled.txt' }]})
          .then(message => download = message.attachments.first().url)
          .catch(() => null);
        };
      };

      message.channel.stopTyping();
      return message.channel.send(
        embed.addFields([
          {
            name: '\\📤 Output',
            value: output.length > 1000
            ? `\`\`\`fix\nExceeded 1000 characters\nCharacter Length: ${output.length}\`\`\``
            : `\`\`\`js\n${output}\n\`\`\``
          },
          { name: '\u200b', value: `[\`📄 View\`](${bin}) • [\`📩 Download\`](${download})` }
        ].splice(0, Number(output.length > 1000) + 1))
      );
    } catch (err) {

      const stacktrace = text.joinArrayAndLimit(err.stack.split('\n'),900,'\n');
      const value = [
        '```xl',
        stacktrace.text,
        stacktrace.excess ? `\nand ${stacktrace.excess} lines more!` : '',
        '```'
      ].join('\n');

      message.channel.stopTyping();
      return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setFooter([
          `${err.name}`,
          `Evaluated in ${Math.abs(Date.now() - message.createdTimestamp)}ms.`,
          `Eval | \©️${new Date().getFullYear()} SmartWiki`].join('\u2000•\u2000'))
        .addFields([
          { name: '\\📥 Input', value: `\`\`\`js\n${text.truncate(text.clean(args.join(' ')),1000,'\n...')}\`\`\``  },
          { name: '\\📤 Output', value }
        ])
      );
    };
  
  }
};