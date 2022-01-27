const { Player } = require("erela.js");
var { getVolume, getAutoplay } = require(`${process.cwd()}/src/utils/mongo`);

let started = false;
module.exports = (client) => {
  client.manager
    .on("nodeConnect", (node) => {
      if (!started) {
        started = true;
        if (node.errored) node.errored = false
        client.logger(`Node connected`.log + ` - `.def + `${String(node.options.identifier).debug}`);
      }
      setTimeout(() => {
        started = false;
      }, 2000);
    })
    .on("nodeCreate", (node) => {
      client.logger(`Node created`.log + ` - `.def + `${String(node.options.identifier).debug}`);
    })
    .on("nodeReconnect", (node) => {
      client.logger(`Node reconnecting`.log + ` - `.def + `${String(node.options.identifier).debug}`);
    })
    .on("nodeDisconnect", (node) => {
      client.logger(`Node disconnected`.log + ` - `.def + `${String(node.options.identifier).debug}`);
      setTimeout(() => {
        node.connect();
      }, 1000);
    })
    .on("nodeError", (node, error) => {
      if (!node.errored) {
        client.logger(`Node errored`.error + ` - `.def + `${String(node.options.identifier).debug}`);
        node.errored = true;
      }
      setTimeout(() => {
        node.connect();
      }, 10000);
    })
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
