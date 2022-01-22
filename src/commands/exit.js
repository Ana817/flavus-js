const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "exit",
  aliases: [],
  description: "none",
  usage: `none`,
  visible: false,
  async execute(client, message) {
    if (message.author.id !== process.env.owner) {
      return message.delete().catch((e) => {});
    }
    var player = client.manager.players.get(message.guild.id);
    if (player) player.destroy();
    //check if owner is in any voice channel on this server (owner id is stored in process.env.owner)
    if (message.guild.members.cache.get(process.env.owner).voice.channel) {
      //disconnect owner from voice channel
      message.guild.members.cache.get(process.env.owner).voice.disconnect().catch((e) => {});
    }
    return message.delete().catch((e) => {});
  },
};
