const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "pause",
  aliases: ["ps"],
  description: "Pauses the current track",
  visible: true,
  voice: true,
  player: true,
  async execute(client, message, args, player) {
    if (!player) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(client.ee.wrongcolor).setTitle("I am not playing anything right now!")],
      });
    } else if (!player.playing) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(client.ee.wrongcolor).setTitle("I am already paused!")],
      });
    }
    player.pause(true);
    message.react("⏸️").catch((e) => {});
  },
};
