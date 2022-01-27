const { MessageEmbed } = require("discord.js");
var { format } = require(`${process.cwd()}/src/utils/functions`);

module.exports = {
  name: "grab",
  description: "Sends info about the current track to your DM",
  visible: true,
  player: true,
  async execute(client, message , args, player) {
    if (!player || !player.queue.current) { // if there is no player or no current track
      message.author.send({
        embeds: [new MessageEmbed()
          .setColor(client.embed.wrongcolor)
          .setTitle(`There is no song playing right now!`)
          .setTimestamp()
          .setFooter({ text: `Requested in - ${message.guild.name}`, iconURL: message.guild.iconURL()})
        ]
      });
      return message.delete().catch((e) => {});
    }
    message.author.send({
      embeds: [new MessageEmbed()
        .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
        .setURL(player.queue.current.uri)
        .setColor(client.embed.color)
        .setTitle(`${player.queue.current.title}`)
        .addField(`Duration:`, `\`${format(player.queue.current.duration)}\``, true)
        .addField(`Author`, `\`${player.queue.current.author}\``, true)
        .addField(`Requested by:`, `\`${player.queue.current.requester.tag}\``, true)
        .setTimestamp()
        .setFooter({ text: `Requested in - ${message.guild.name}`, iconURL: message.guild.iconURL()})
      ]
    }).catch(e => {
      message.author.send('Error')
      return message.delete().catch((e) => {});
    })
    return message.delete().catch((e) => {});
  },
};
