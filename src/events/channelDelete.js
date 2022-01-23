module.exports = async (client, channel) => {
  if (channel.type === "GUILD_VOICE") {
    if (channel.members.has(client.user.id)) {
      var player = client.manager.players.get(channel.guild.id);
      if (!player) return;
      if (channel.id === player.voiceChannel) {
        //destroy
        player.destroy();
      }
    }
  }
}

/**
 * @INFO
 * Code by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 */
