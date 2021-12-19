const { MessageEmbed } = require("discord.js");
const { createBar } = require(`${process.cwd()}/utils/functions`);

module.exports = {
  name: "seek",
  description: "Seeks to given time",
  usage: `\`<prefix> seek 10\` or \`<prefix> seek 1:24:25\``,
  visible: true,
  player: true,
  voice: true,
  async execute(client, message, args, player) {
    if (!args[0]) { // if no args return error
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(client.ee.color).setTitle("No arguments provided!").setDescription(createBar(player))],
      });
    } 
    const timeSplit = args[0].split(":");
    if (!timeSplit.every((item) => !isNaN(item) && item.length > 0)) { // if time is not in correct format return error
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(client.ee.wrongcolor).setTitle("Time is not in correct format")],
      });
    } 
    let seek;
    if (timeSplit.length === 1) { // if time is in seconds
      seek = client.toTime.fromSeconds(timeSplit[0]).ms(); 
    } else if (timeSplit.length === 2) { // if time is in minutes and seconds
      seek = client.toTime.fromSeconds(timeSplit[1]).ms() + client.toTime.fromMinutes(timeSplit[0]).ms(); 
    } else if (timeSplit.length === 3) { // if time is in hours, minutes and seconds
      seek = client.toTime.fromSeconds(timeSplit[2]).ms() + client.toTime.fromMinutes(timeSplit[1]).ms() + client.toTime.fromHours(timeSplit[0]).ms(); 
    } else {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(client.ee.wrongcolor).setTitle("Time is not in correct format")],
      });
    }
    if (seek < 0 || seek >= player.queue.current.duration) // if user tries to seek to a time that is not in the track return error
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(client.ee.wrongcolor)
            .setTitle(`You may seek from \`0\` - \`${new Date(player.queue.current.duration).toISOString().substr(11, 8)}\``)
            .setDescription(createBar(player)),
        ],
      });
    player.seek(seek); // seek to time
    return message.reply({ // send success message
      embeds: [
        new MessageEmbed()
          .setTitle(`Seeked to - ${new Date(player.position).toISOString().substr(11, 8)}`)
          .setDescription(createBar(player))
          .setColor(client.ee.color),
      ],
    });
  },
};
