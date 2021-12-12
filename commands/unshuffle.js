const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "unshuffle",
  aliases: ["unshuffle"],
  description: "Undo last shuffle",
  usage: `none`,
  visible: true,
  async execute(client, message, args) {
    if (!message.member.voice.channel) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(client.ee.wrongcolor).setTitle("You must be in a voice channel to use this command!")],
      });
    }
    var player = client.manager.players.get(message.guild.id);
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
