const playermanager = require(`${process.cwd()}/src/utils/handlers/playermanager`);

module.exports = {
  name: "play",
  aliases: ["p"],
  description: "Adds a track or playlist to the queue",
  usage: `\`<prefix>play <track>\` or \`<prefix>p <playlist_url>\``,
  visible: true,
  voice: true,
  async execute(client, message, args) {
    if (!args[0]) { // if no args
      return message.channel.send(client.error("You need to specify a track or playlist!"));
    }

    if (args.join("").includes("spotify")) {
      playermanager(client, message, args, `song:raw`);
    } else {
      playermanager(client, message, args, `song:youtube`);
    }
  },
};
