const { MessageEmbed } = require("discord.js");
var { format } = require(`${process.cwd()}/utils/functions`);

module.exports = {
  name: "grab",
  aliases: ["mine"],
  description: "Sends current song to your DM",
  usage: `none`,
  visible: false,
  async execute(client, message) {
    var player = client.manager.players.get(message.guild.id);
    if (!player || !player.queue.current) {
      message.author.send({
        embeds: [new MessageEmbed()
          .setColor(client.ee.wrongcolor)
          .setTitle(`There is no song playing right now!`)
          .setTimestamp()
          //set guild icon as footer
          .setFooter(`Requested in - ${message.guild.name}`, message.guild.iconURL())
          //get guild avatar url
        ]
      });
      return message.delete().catch((e) => {});
    }
    message.author.send({
      embeds: [new MessageEmbed()
        .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
        .setURL(player.queue.current.uri)
        .setColor(client.ee.color)
        .setTitle(`${player.queue.current.title}`)
        .addField(`Duration:`, `\`${format(player.queue.current.duration)}\``, true)
        .addField(`Author`, `\`${player.queue.current.author}\``, true)
        .addField(`Requested by:`, `\`${player.queue.current.requester.tag}\``, true)
        .setTimestamp()
        .setFooter(`Requested in: ${message.guild.name}`, message.guild.iconURL())
      ]
    }).catch(e => {
      message.author.send('Error')
      return message.delete().catch((e) => {});
    })
    return message.delete().catch((e) => {});
  },
};
