const { MessageEmbed } = require("discord.js");
const playermanager = require(`${process.cwd()}/handlers/playermanager`);

module.exports = {
  name: "playnow",
  aliases: ["pn", "pt", "playtop"],
  description: "Adds a track to the top of the queue",
  usage: `\`<prefix>playnow <track>\` or \`<prefix>pn <playlist_url>\``,
  visible: true,
  voice: true,
  async execute(client, message, args) {
    if (!args[0]) // if no args
      return message.channel.send(client.error("You need to specify a track or playlist!"));
    if (args.join("").includes("spotify")) {
      playermanager(client, message, args, `playtop:raw`);
    } else {
      playermanager(client, message, args, `playtop:youtube`);
    }
  },
};
