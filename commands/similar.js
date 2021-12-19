const { MessageEmbed } = require("discord.js");
const playermanager = require(`${process.cwd()}/handlers/playermanager`);

module.exports = {
  name: "similar",
  aliases: ["sm"],
  description: "Adds one or multiple tracks similar to the one currently playing or by query",
  info: "If you want to add mutliple similar tracks, you need to add number\nsurrounded by \`< >\` to the end",
  usage: `\`<prefix>similar\` or \`<prefix>sm <query> <<number>>\``,
  visible: true,
  voice: true,
  async execute(client, message, args) {
    //check if the user is in a voice channel
    if (args[0]) {
      if (args.join("").includes("spotify")) {
        playermanager(client, message, args, `similar:raw`);
      } else {
        playermanager(client, message, args, `similar:youtube`);
      }
    } else {
      playermanager(client, message, args, `similar:youtube`);
    }
  },
};
