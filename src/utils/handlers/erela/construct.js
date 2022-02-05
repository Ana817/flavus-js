var { Manager } = require("erela.js");
var Spotify = require("erela.js-spotify");
var Facebook = require("erela.js-facebook");

module.exports = (client) => {
  client.manager = new Manager({
    nodes: [{
      host: process.env.LAVALINK_HOST,
      port: Number(process.env.LAVALINK_PORT),
      password: process.env.LAVALINK_PASSWORD,
      secure: process.env.LAVALINK_SECURE === "true",
    }],
    plugins: [
      new Spotify({
        clientID: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
      }),
      new Facebook(),
    ],
    send(id, payload) {
      var guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    },
  });

  client.logger(`ErelaJS initialized!`.log);

  client.once("ready", () => {
    client.manager.init(client.user.id);
  });
  //require the other events
  require("./node_events")(client);
  require("./events")(client)
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
