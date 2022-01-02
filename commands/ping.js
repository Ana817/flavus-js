const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Debug command",
  usage: `none`,
  visible: false,
  player: true,
  async execute(client, message, args, player) {
    let data = player.get(`beforeshuffle`);
    console.log(data);
    console.log(typeof data);
    console.log(data.length);
  },
};
