const { MessageEmbed } = require("discord.js");
const playermanager = require(`${process.cwd()}/handlers/playermanager`);

module.exports = {
  name: "play",
  aliases: ["p"],
  description: "Add a track to the queue",
  usage: `\`<prefix>play <track>\` or \`<prefix>p <playlist_url>\``,
  visible: true,
  voice: true,
  async execute(client, message, args) {
    if (!args[0]) { // if no args
      return message.reply({
        embeds: [
          new MessageEmbed().setColor(client.ee.wrongcolor).setTitle("No arguments provided!"),
        ],
      });
    }

    if (args.join("").includes("spotify")) {
      playermanager(client, message, args, `song:raw`);
    } else {
      playermanager(client, message, args, `song:youtube`);
    }
  },
};
