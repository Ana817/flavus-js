const { MessageEmbed } = require("discord.js");
const playermanager = require(`${process.cwd()}/src/utils/handlers/playermanager`);

module.exports = {
  name: "search",
  aliases: ["sr"],
  description: "Seach for tracks",
  usage: `\`<prefix>search <query>\``,
  visible: true,
  voice: true,
  async execute(client, message, args) {
    if (!args[0]) // if no args return
      return message.channel.send(client.error("You need to specify a query!"));
    playermanager(client, message, args, `search:youtube`);
  },
};
