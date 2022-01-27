const { Player, TrackUtils } = require("erela.js");
var { getVolume, getAutoplay, getAutoresume, setAutoresume, savePlayer, getPlayer } = require(`${process.cwd()}/src/utils/mongo`);

module.exports = (client) => {

  playerintervals = new Map();

  const autoconnect = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const resumeGuilds = await getAutoresume();
    resumeGuilds.forEach(async (guild) => {
      const sPlayer = await getPlayer(guild.guildID);
      console.log(sPlayer.timestamp);
      if (Date.now() - sPlayer.timestamp > 300000) return;
      console.log(sPlayer.timestamp);
      //if sPlayer.queue is empty, and sPlayer.current is empty as well, don't resume
      if (sPlayer.queue.length === 0 && !sPlayer.current) return;
      //sPlayer.options.voiceChannel is voiceChannel id. check if there are any members connected to that voiceChannel
      const voiceChannel = client.channels.cache.get(sPlayer.options.voiceChannel);
      if (!voiceChannel || !voiceChannel.members || voiceChannel.members.size == 0 || voiceChannel.members.filter(m => !m.user.bot && !m.voice.deaf && !m.voice.selfDeaf).size < 1) return;
      //create player
      let player = await client.manager.create({
        guild: guild.guildID,
        voiceChannel: sPlayer.options.voiceChannel,
        textChannel: sPlayer.options.textChannel,
        selfDeafen: true,
      })
      if (player && player.node && !player.node.connected) await player.node.connect()
      await player.connect();
      const buildTrack = async (data) => {
        return data.track && data.identifier ? TrackUtils.build({
            track: data.track,
            info: {
              title: data.title || null,
              identifier: data.identifier,
              author: data.author || null,
              length: data.length || data.duration || null,
              isSeekable: !!data.isStream,
              isStream: !!data.isStream,
              uri: data.uri || null,
              thumbnail: data.thumbnail || null,
            }
          }, data.requester ? client.users.cache.get(data.requester) || await client.users.fetch(data.requester).catch(() => {}) || null : null) :
          TrackUtils.buildUnresolved({
            title: data.title || '',
            author: data.author || '',
            duration: data.duration || 0
          }, data.requester ? client.users.cache.get(data.requester) || await client.users.fetch(data.requester).catch(() => {}) || null : null)
      }
      player.queue.add(await buildTrack(sPlayer.current));
      await player.play();
      //if (sPlayer.current.paused) player.pause(true), player.paused = true;
      /*
      ********************************
      MUST FIX THIS
      ********************************
      */
      if (sPlayer.current.position > 0) await player.seek(sPlayer.current.position);
      if (sPlayer.queue.length)
        for (let track of sPlayer.queue) player.queue.add(await buildTrack(track));
    });
  }
  //autoconnect()
  
  client.manager
    .on("playerCreate", async (player) => {
      getVolume(player, client);

      var saveInterval = setInterval(async () => {
        let thisPlayer = client.manager.players.get(player.guild)
        if (thisPlayer) {
          savePlayer(thisPlayer, client);
        }
      }, 10000);
      playerintervals.set(player.guild, saveInterval);
      await setAutoresume(player.guild, true);
      
    })
    .on(`playerDestroy`, async (player) => {   
      clearInterval(playerintervals.get(player.guild));
      await setAutoresume(player.guild, false);
    })
    .on("queueEnd", (player) => {
      getAutoplay(player, client);
    })
    .on("trackStart", (player) => {
      player.set(
        `previousTrack`,
        player.queue.current
      );
    })
    .on(`playerMove`, async (player, oldChannel, newChannel) => {
      if (!newChannel) {
        await player.destroy();
      } else {
        player.set('moved', true)
        player.setVoiceChannel(newChannel);
        if (player.paused) return;
        setTimeout(() => {
          player.pause(true);
          setTimeout(() => player.pause(false), client.ws.ping * 2);
        }, client.ws.ping * 2);
      }
    })
    .on(`nodeConnect`, (node) => {
      setTimeout(() => autoconnect(), 2 * client.ws.ping)
    })
};


