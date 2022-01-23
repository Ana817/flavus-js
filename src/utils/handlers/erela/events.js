const { Player } = require("erela.js");
var { getVolume, getAutoplay } = require(`${process.cwd()}/src/utils/mongo`);

let started = false;
module.exports = (client) => {
  client.manager
    .on("playerCreate", (player) => {
      getVolume(player, client);
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
};
