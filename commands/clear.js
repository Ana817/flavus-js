const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  description: "Clears the queue",
  visible: true,
  player: true,
  async execute(client, message, args, player) {
    if (!player) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(client.ee.wrongcolor).setTitle("I am not playing anything right now!")],
      });
    }
    player.queue.clear();
    return message.react("✅").catch((e) => {});
  },
};