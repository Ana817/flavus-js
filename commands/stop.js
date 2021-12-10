const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "stop",
    aliases: ["stop"],
    description: "Stops player",
    usage: `none`,
    visible: true,
    async execute(client, message) {
        if (!message.member.voice.channel) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(client.ee.wrongcolor)
                .setTitle('You must be in a voice channel to use this command!') 
                ]
            });
        }
        var player = client.manager.players.get(message.guild.id);
        if (!player) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(client.ee.wrongcolor)
                .setTitle('I am not playing anything right now!') 
                ]
            });
        }
        player.destroy();
        return message.react('🛑').catch((e) => {})

    }
}