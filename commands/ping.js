const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
var { autoplay } = require(`${process.cwd()}/utils/functions`);

module.exports = {
  name: "ping",
  description: "Debug command",
  usage: `none`,
  visible: false,
  player: true,
  async execute(client, message, args, player) {
    console.log(player)
  },
};
