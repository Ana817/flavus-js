module.exports = async (client, guild) => {
  var player = client.manager.players.get(guild.id);
  if (!player) return;
  if (guild.id == player.guild) {
    //destroy
    player.destroy();
  }
}

/**
 * @INFO
 * Code by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 */
