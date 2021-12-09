const { MessageEmbed } = require('discord.js');
const play = require('./play');
const ee = require(`${process.cwd()}/config/embed.json`)
const playermanager = require(`${process.cwd()}/handlers/playermanager`);

module.exports = {
    name: "skip",
    aliases: ["s"],
    description: "Skips to next track",
    usage: `none`,
    visible: true,
    async execute(client, message, args) {
        const {
            channel
          } = message.member.voice;
          //if the member is not in a channel, return
          if (!channel)
            return message.reply({
              embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle('You are not in a voice channel!')
              ]
            });
        var player = client.manager.players.get(message.guild.id);
          //if no player available return aka not playing anything
          if (!player) {
            if (message.guild.me.voice.channel) {
              message.reply({
                embeds: [new MessageEmbed()
                  .setTitle('There is no player!')
                  .setColor(ee.color)
                ]
              });
              return message.react(emoji.react.stop).catch((e) => {})
            } else {
              return message.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.wrongcolor)
                  .setTitle('Im not playing anything!')
                ]
              });
            }
            return
          }
          //if not in the same channel as the player, return Error
          if (channel.id !== player.voiceChannel)
            return message.reply({
              embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle('You are not in the same voice channel as me!')
              ]
            });
          //if ther is nothing more to skip then stop music and leave the Channel
          if (player.queue.size == 0) {
              if (!player.queue.current) {
                if (message.guild.me.voice.channel) {
                message.reply({
                    embeds: [new MessageEmbed()
                    .setTitle('No more tracks in queue!')
                    .setColor(ee.color)
                    ]
                });
                return
                } else {
                    try {
                        player.destroy();
                    } catch {}
                message.reply({
                    embeds: [new MessageEmbed()
                    .setTitle('No more tracks in queue!')
                    .setColor(ee.color)
                    ]
                });
                return
                }
                }
          }
          //skip the track
          player.stop();
          //send success message
      
          return message.react('⏭').catch((e) => {})

    }
}