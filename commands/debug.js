const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
var { autoplay } = require(`${process.cwd()}/utils/functions`);

module.exports = {
  name: "debug",
  description: "Debug command",
  usage: `none`,
  player: true,
  visible: false,
  async execute(client, message, args, player) {
    //join args into a string
    if (!player) return
    if (!player.get(`similarQueue`)) return message.channel.send(`smQueue has not been generated yet!`)
    const similarQueue = player.get(`similarQueue`);
    message.channel.send(`**Debug** - smQueue length - \`${similarQueue.length}\``)
  },
};
