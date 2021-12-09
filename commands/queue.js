const { MessageEmbed } = require('discord.js');
const ee = require(`${process.cwd()}/config/embed.json`)
const playermanager = require(`${process.cwd()}/handlers/playermanager`);
var {
  format,
  createQueueEmbed
} = require(`${process.cwd()}/utils/functions`)

module.exports = {
    name: "queue",
    aliases: ["q", "np"],
    description: "Prints current queue and current song",
    usage: `none`,
    visible: true,
    async execute(client, message, args) {


        var player = client.manager.players.get(message.guild.id);

        if (!player) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(ee.color)
                .setTitle('Queue is empty!') 
                ]
            });
        }


        message.channel.send({
            embeds: [createQueueEmbed(player, 0)]
        }).then(message => {
            
            var player = client.manager.players.get(message.guild.id);
            const tracks = player.queue;

            // exit if there is only one page of guilds (no need for all of this)
            if (tracks.length <= 10) return
            // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
            message.react('➡️')
            const collector = message.createReactionCollector(
              // only collect left and right arrow reactions from the message author
              (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id !== client.user.id,
              // time out after a minute
              {time: 60000}
            )
          
            let currentIndex = 0
            collector.on('collect', async (reaction, user)=> {
                //do not react to own reactions
                if (user.id === client.user.id) return
              // remove the existing reactions
              await message.reactions.removeAll()
              // increase/decrease index
              reaction.emoji.name === '⬅️' ? currentIndex -= 15 : currentIndex += 15
              // edit message with new embed
              await message.edit({
                embeds: [createQueueEmbed(player, currentIndex)]
                })
              // react with left arrow if it isn't the start
              if (currentIndex !== 0) await message.react('⬅️')
              // react with right arrow if it isn't the end
              if (currentIndex + 15 < tracks.length) await message.react('➡️')
            })
        })
    }
}