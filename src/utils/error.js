const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/config.json`);
const eb = config.visuals.embed;

function error(error) {
  let embed = new MessageEmbed()
    .setColor(eb.wrongcolor)
    .setTitle(error)
  let message = { embeds: [embed] }
  return message;
}

module.exports = error

  