const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "previous",
  aliases: ["prev", "replay"],
  description: "Plays previous track",
  visible: true,
  voice: true,
  player: true,
  async execute(client, message, args, player) {
    if (!player) return message.channel.send(client.error("Player is not initialized!"));
    let previous = player.queue.previous
    if (!previous) {
      if (!player.get(`previousTrack`)) return message.channel.send(client.error("No previous track found!"));
      previous = player.get(`previousTrack`);
    }
    let oldQueue = []
    for (const track of player.queue)
      oldQueue.push(track);
    //clear queue
    player.queue.clear();
    //add new tracks
    player.queue.add(previous);
    player.queue.add(player.queue.current);
    for (const track of oldQueue)
      player.queue.add(track);
    player.stop();
    
    return message.react("🔄").catch((e) => {});
  },
};
