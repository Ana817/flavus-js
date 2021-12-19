const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "unshuffle",
  description: "Undo last shuffle if available",
  visible: true,
  voice: true,
  player: true,
  async execute(client, message, args, player) {
    if (!player)
      return message.reply({
        embeds: [new MessageEmbed().setColor(client.ee.wrongcolor).setTitle("Nothing is playing!")],
      });
    if (!player.get(`beforeshuffle`))
      return message.reply({
        embeds: [new MessageEmbed().setColor(client.ee.wrongcolor).setTitle("You have not shuffled this queue!")],
      });
    //clear teh Queue
    player.queue.clear();
    //now add every old song again
    for (const track of player.get(`beforeshuffle`)) player.queue.add(track);
    //return success message
    return message.react("👌").catch((e) => {});
  },
};
