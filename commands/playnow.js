const { MessageEmbed } = require("discord.js");
const playermanager = require(`${process.cwd()}/handlers/playermanager`);

module.exports = {
  name: "playnow",
  aliases: ["pn", "pt", "playtop"],
  description: "Add a track to secont position in the queue",
  usage: `none`,
  visible: true,
  async execute(client, message, args) {
    //if no args return error
    if (!args[0])
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(client.ee.wrongcolor)
            .setTitle("No arguments provided!"),
        ],
      });
    if (args.join("").includes("spotify")) {
      playermanager(client, message, args, `playtop:raw`);
    } else {
      playermanager(client, message, args, `playtop:youtube`);
    }
  },
};
