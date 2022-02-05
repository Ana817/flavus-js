const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
var { savePlayer } = require(`${process.cwd()}/src/utils/mongo`);
const guildSettings = require(`${process.cwd()}/src/models/guildSettings`);

module.exports = {
  name: "debug",
  description: "Debug command",
  usage: `none`,
  player: true,
  visible: false,
  async execute(client, message, args, player) {
      return
  },
};
