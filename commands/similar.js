const { MessageEmbed } = require("discord.js");
const playermanager = require(`${process.cwd()}/handlers/playermanager`);

module.exports = {
  name: "similar",
  aliases: ["sm"],
  description: "Seach for track",
  usage: `none`,
  visible: true,
  async execute(client, message, args) {
    //check if the user is in a voice channel
    if (!message.member.voice.channel) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.ee.wrongcolor)
            .setTitle("You must be in a voice channel to use this command!"),
        ],
      });
    }
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
