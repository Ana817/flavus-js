const { MessageEmbed } = require('discord.js');
const ee = require(`${process.cwd()}/config/embed.json`)
const playermanager = require(`${process.cwd()}/handlers/playermanager`);

module.exports = {
    name: "resume",
    aliases: ["rs"],
    description: "Resume",
    usage: `none`,
    visible: true,
    async execute(client, message, args) {
        //check if author is in a voice channel
        if (!message.member.voice.channel) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle('You must be in a voice channel to use this command!') 
                ]
            });
        }
        var player = client.manager.players.get(message.guild.id);
        if (!player) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle('I am not playing anything right now!') 
                ]
            });
        } else if (player.playing) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle('I am not paused!') 
                ]
            });
        }
        player.pause(false);
        message.react("⏯").catch((e) => {})
    }
}