const { MessageEmbed } = require('discord.js');
const guildSettings = require('../models/guildSettings');

module.exports = {
    name: "volume",
    aliases: ["v"],
    description: "Sets volume",
    usage: `none`,
    visible: true,
    async execute(client, message, args) {

        var player = client.manager.players.get(message.guild.id);
        if (!player) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(client.ee.wrongcolor)
                .setTitle('I am not playing anything right now!') 
                ]
            });
        }
        if (!args[0])
        return message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(client.ee.color)
            .setDescription(`Current volume is \`${player.volume}%\``)
            ]
        });
        if (Number(args[0]) <= 0 || Number(args[0]) > 150)
        return message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(client.ee.wrongcolor)
            .setTitle('Volume must be between 0 and 150!') 
            .setDescription(`Current volume is \`${player.volume}%\``)
            ]
        });
        if (isNaN(args[0]))
        return message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(client.ee.wrongcolor)
            .setTitle('Argument must be a number!')
            .setDescription(`Current volume is \`${player.volume}%\``)
            ]
        });
        player.setVolume(Number(args[0]));
        message.channel.send({
        embeds: [new MessageEmbed()
            .setTitle('Volume set!')
            .setDescription(`Current volume is \`${player.volume}%\``)
            .setColor(client.ee.color)
        ]
        });
        guildSettings.findOne({ guildID: player.options.guild }, (err, settings) => {
            if (err) return client.clog(err);
            if (!settings) {
                settings = new guildSettings({
                    guildID: player.options.guild,
                    volume: Number(args[0])
                });
                settings.save().catch(err => console.log(err));
            } else {
                settings.volume = Number(args[0]);
                settings.save().catch(err => console.log(err));
            }
        });
    }
}