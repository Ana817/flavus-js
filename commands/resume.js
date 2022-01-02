const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "resume",
  aliases: ["rs"],
  description: "Resumes music if paused", 
  visible: true,
  player: true,
  voice: true,
  async execute(client, message, args, player) {
    if (!player) {
      return message.channel.send(client.error("I am not playing anything right now!"));
    } else if (player.playing) {
      return message.channel.send(client.error("I am not paused!"));
    }
    player.pause(false);
    message.react("⏯").catch((e) => {});
  },
};
