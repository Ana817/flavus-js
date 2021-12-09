const { MessageEmbed } = require('discord.js');
const ee = require(`${process.cwd()}/config/embed.json`)
const {
    createBar,
    format,
  } = require(`${process.cwd()}/utils/functions`);

module.exports = {
    name: "seek",
    aliases: [],
    description: "Seeks to given time",
    usage: `none`,
    visible: true,
    async execute(client, message, args) {
        
        var player = client.manager.players.get(message.guild.id);
        if (!player) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle('I am not playing anything right now!') 
                ]
            });
        }

        if(!args[0]){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(ee.color)
                .setTitle('No arguments provided!') 
                .setDescription(createBar(player))
                ]
            });
        }
        //split args by :
        const timeSplit = args[0].split(':');

        if(!timeSplit.every(item => !isNaN(item) && item.length > 0)) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle('Time is not in correct format') 
                ]
            });
        }
        
        
        let seek
        if(timeSplit.length === 1){
            seek = client.toTime.fromSeconds(timeSplit[0]).ms()
        } else if(timeSplit.length === 2){
            seek = (client.toTime.fromSeconds(timeSplit[1]).ms() + client.toTime.fromMinutes(timeSplit[0]).ms())
        } else if(timeSplit.length === 3){
            seek = (client.toTime.fromSeconds(timeSplit[2]).ms() + client.toTime.fromMinutes(timeSplit[1]).ms() + client.toTime.fromHours(timeSplit[0]).ms())
        } else {
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle('Time is not in correct format') 
                ]
            });
        }



        if (seek < 0 || seek >= player.queue.current.duration)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            //.setTitle(`You may seek from \`0\` - \`${format(Number(player.queue.current.duration))}\``)
            .setTitle(`You may seek from \`0\` - \`${new Date(player.queue.current.duration).toISOString().substr(11, 8)}\``)
            .setDescription(createBar(player))
            ]
        });
        //seek to the position
        player.seek(seek);
        //send success message
        return message.reply({
        embeds: [new MessageEmbed()
            .setTitle(`Seeked to - ${new Date(player.position).toISOString().substr(11, 8)}`)
            .setDescription(createBar(player))
            .setColor(ee.color)
        ]
        });
        //optimize and clean up code
        
    }

}
