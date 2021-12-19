const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "stop",
  description: "Stops player, clears queue and leaves voice channel",
  visible: true,
  player: true,
  async execute(client, message, args, player) {
    if (!player) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(client.ee.wrongcolor).setTitle("I am not playing anything right now!")],
      });
    }
    player.destroy();
    return message.react("🛑").catch((e) => {});
  },
};
