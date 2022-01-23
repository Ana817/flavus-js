const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Debug command",
  usage: `none`,
  visible: false,
  player: true,
  async execute(client, message, args, player) {
    message.channel.send({
      embeds: [new MessageEmbed().setColor(client.ee.color).setTitle("Measuring...")],
    }).then (async (msg) => {
      msg.delete()
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(client.ee.color).setTitle("Pong!").setDescription(`Latency - \`${msg.createdTimestamp - message.createdTimestamp}ms\`\nAPI Latency - \`${Math.round(client.ws.ping)}ms\``)],
      });
    });
  },
};
