const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "watchtogether",
  aliases: ["yt", "w2", "youtube"],
  description: "Strats a watchtogether session in your vc",
  visible: true,
  async execute(client, message, args) {
    if (!message.member.voice.channel) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.embed.wrongcolor)
            .setTitle("You must be in a voice channel to use this command!"),
        ],
      });
    }
    if (args[0] === "dev") {
      client.discordTogether.createTogetherCode(message.member.voice.channel.id, "youtubeDev").then(async (invite) => {
        const row = new MessageActionRow().addComponents(
          new MessageButton().setLabel("Join").setStyle("LINK").setURL(invite.code)
        );

        const Embed = new MessageEmbed().setColor(client.embed.color).setTitle("WatchTogether session created!");

        return message.channel.send({ embeds: [Embed], components: [row] });
      });
    } else {
      client.discordTogether.createTogetherCode(message.member.voice.channel.id, "youtube").then(async (invite) => {
        const row = new MessageActionRow().addComponents(
          new MessageButton().setLabel("Join").setStyle("LINK").setURL(invite.code)
        );

        const Embed = new MessageEmbed().setColor(client.embed.color).setTitle("WatchTogether session created!");

        return message.channel.send({ embeds: [Embed], components: [row] });
      });
    }
  },
};
