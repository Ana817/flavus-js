const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: "Skips to next or specific track",
  usage: `\`<prefix>skip\` or \`<prefix>s <position in queue>\``,
  visible: true,
  voice: true,
  player: true,
  async execute(client, message, args, player) {
    if (!player) {
      if (message.guild.me.voice.channel) {
        message.reply({
          embeds: [new MessageEmbed().setTitle("There is no player!").setColor(client.ee.color)],
        });
        return message.react(emoji.react.stop).catch((e) => {});
      } else {
        return message.reply({
          embeds: [new MessageEmbed().setColor(client.ee.wrongcolor).setTitle("Im not playing anything!")],
        });
      }
    }
    //if not in the same channel as the player, return
    if (message.member.voice.channel.id !== player.voiceChannel)
      return message.reply({
        embeds: [new MessageEmbed().setColor(client.ee.wrongcolor).setTitle("You are not in the same voice channel as me!")],
      });
    //if ther is nothing more to skip then stop music and leave the Channel
    if (player.queue.size == 0) {
      if (!player.queue.current) {
        if (message.guild.me.voice.channel) {
          message.reply({
            embeds: [new MessageEmbed().setTitle("No more tracks in queue!").setColor(client.ee.color)],
          });
          return;
        } else {
          try {
            player.destroy();
          } catch {}
          message.reply({
            embeds: [new MessageEmbed().setTitle("No more tracks in queue!").setColor(client.ee.color)],
          });
          return;
        }
      }
    }
    player.set(
      `previousTrack`,
      player.queue.current
    );
    if (args[0] || !isNaN(args[0])) {
      if (Number(args[0]) > player.queue.size || Number(args[0]) < 1) { //if the user wants to skip more tracks than are in the queue
        message.reply({
          embeds: [new MessageEmbed().setTitle("Can't skip there!").setColor(client.ee.color)],
        });
        return;
      } else {
        if (args[0] != 1) player.queue.remove(0, Number(args[0]) - 1); //remove tracks from queue
      }
    }
    player.stop(); // skip the track
    return message.react("⏭").catch((e) => {});
  },
};
