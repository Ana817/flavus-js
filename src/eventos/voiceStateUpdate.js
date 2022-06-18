
module.exports = async (client, oldState, newState) => {
  //auto set Speaker in Stage Channel
  if (newState.channelId && newState.channel.type == "GUILD_STAGE_VOICE" && newState.guild.me.voice.suppress) {
    if (newState.guild.me.permissions.has(Permissions.FLAGS.SPEAK) || (newState.channel && newState.channel.permissionsFor(newState.guild.me).has(Permissions.FLAGS.SPEAK))) {
      newState.guild.me.voice.setSuppressed(false).catch(() => {});
    }
  }

  /**
   * Auto Leave Channel on EMPTY OR EVERYONE IS DEAFED!
   */
  

  /**
   * ALWAYS SERVER DEAF THE BOT WHEN JOING
   */
  if (newState.id === client.user.id && newState.channelId != oldState.channelId && !newState.guild.me.voice.deaf) {
    if (newState.guild.me.permissions.has(Permissions.FLAGS.DEAFEN_MEMBERS) || (newState.channel && newState.channel.permissionsFor(newState.guild.me).has(Permissions.FLAGS.DEAFEN_MEMBERS))) {
      newState.setDeaf(true).catch(() => {});
    }
  }

  /**
   * ANTI UNDEAF THE BOT 
   */
  if (newState.id === client.user.id && oldState.serverDeaf === true && newState.serverDeaf === false) {
    if (newState.guild.me.permissions.has(Permissions.FLAGS.DEAFEN_MEMBERS) || (newState.channel && newState.channel.permissionsFor(newState.guild.me).has(Permissions.FLAGS.DEAFEN_MEMBERS))) {
      newState.setDeaf(true).catch(() => {});
    }
  }
};
