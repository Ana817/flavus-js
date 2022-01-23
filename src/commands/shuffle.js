const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "shuffle",
  aliases: ["sf"],
  description: "Shuffles current queue",
  visible: true,
  voice: true,
  player: true,
  async execute(client, message, args, player) {
    //shuffle the Queue
    player.queue.shuffle();
    //return success reaction
    return message.react("🔀").catch((e) => {});
  },
};
