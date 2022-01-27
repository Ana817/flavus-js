const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "debugstats",
  aliases: ["runtime"],
  description: "Debug command",
  usage: `none`,
  player: false,
  visible: false,
  async execute(client, message, args, player) {
    message.channel.send({
      embeds: [new MessageEmbed().setColor(client.embed.color).setTitle("Gathering data...")],
    }).then (async (msg) => {
      msg.delete()
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(client.embed.color).setTitle("Debug Embed").setDescription(`Name - \`${client.user.tag}\` - \`[${client.user.id}]\`
        Latency - \`${msg.createdTimestamp - message.createdTimestamp}ms\`
        Api Latency - \`${Math.round(client.ws.ping)}ms\`
        Runtime - \`${client.toTime.fromSeconds(Math.round(client.uptime / 1000)).humanize()}\`
        Memory usage - \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb\``)],
      });
    });
  },
};
