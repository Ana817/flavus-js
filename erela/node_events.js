const { Player } = require("erela.js");
var { getVolume, getAutoplay } = require(`${process.cwd()}/utils/mongo`);

let started = false;
module.exports = (client) => {
  client.manager
    .on("nodeConnect", (node) => {
      if (!started) {
        started = true;
        client.clog(`Node connected`.log + ` - `.def + `${String(node.options.identifier).debug}`);
      }
      setTimeout(() => {
        started = false;
      }, 2000);
    })
    .on("nodeCreate", (node) => {
      client.clog(`Node created`.log + ` - `.def + `${String(node.options.identifier).debug}`);
    })
    .on("nodeReconnect", (node) => {
      client.clog(`Node reconnecting`.log + ` - `.def + `${String(node.options.identifier).debug}`);
    })
    .on("nodeDisconnect", (node) => {
      if (!started) return;
      client.clog(`Node disconnected`.log + ` - `.def + `${String(node.options.identifier).debug}`);
      setTimeout(() => {
        node.connect();
      }, 1000);
    })
    .on("nodeError", (node, error) => {
      client.clog(`Node errored`.error + ` - `.def + `${String(node.options.identifier).debug}`);
      setTimeout(() => {
        node.connect();
      }, 1000);
    })
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
    });
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.dev
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
