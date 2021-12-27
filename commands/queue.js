const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
var { createQueueEmbed } = require(`${process.cwd()}/utils/functions`);

module.exports = {
  name: "queue",
  aliases: ["q", "np"],
  description: "Shows queue and current track progress",
  visible: true,
  player: true,
  async execute(client, message, args, player) {
    if (!player) {
      return message.channel.send({
        embeds: [new MessageEmbed().setColor(client.ee.color).setTitle("Queue is empty!")],
      });
    }
    // create buttons
    let row = new MessageActionRow().addComponents(
      (but_1 = new MessageButton().setCustomId("id_1").setEmoji("⬅️").setStyle("SECONDARY").setDisabled(true)),
      (but_2 = new MessageButton().setCustomId("id_2").setEmoji("➡️").setStyle("SECONDARY"))
    );
    message.channel.send({ embeds: [createQueueEmbed(player, 0)] }) // send first page
    .then((message) => {
        var player = client.manager.players.get(message.guild.id);
        const tracks = player.queue;
        if (tracks.length <= 15) return; // if there are less than 15 tracks in queue then disable buttons
        message.edit({
          components: [row],
        });
        const collector = message.channel.createMessageComponentCollector({ // create collector for buttons
          time: 60000,
        });
        let currentIndex = 0;
        collector.on("collect", async (button) => {
          if (button.message.id !== message.id) return
          if (button.customId === "id_1") { // if left button is pressed
            currentIndex -= 15;
            if (currentIndex === 0) { // if we are on page 1 then disable prevoius button
              row.components[0].setDisabled(true);
            }
            row.components[1].setDisabled(false);
            await message.edit({
              embeds: [createQueueEmbed(player, currentIndex)],
              components: [row],
            });
            await button.deferUpdate();
          } else if (button.customId === "id_2") { // if right button is pressed
            currentIndex += 15;
            if (currentIndex + 15 > tracks.length) { //if we are on last page then disable next button
              row.components[1].setDisabled(true);
            }
            row.components[0].setDisabled(false);
            await message.edit({
              embeds: [createQueueEmbed(player, currentIndex)],
              components: [row],
            });
            await button.deferUpdate();
          }
        });
        collector.on("end", async (button) => { // after 60 seconds remove buttons and set page to 1
          await message.edit({
            embeds: [createQueueEmbed(player, 0)],
            components: [],
          });
        });
      });
  },
};
