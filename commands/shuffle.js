const { MessageEmbed } = require('discord.js');
const ee = require(`${process.cwd()}/config/embed.json`)
const playermanager = require(`${process.cwd()}/handlers/playermanager`);

module.exports = {
    name: "shuffle",
    aliases: ["shuffle"],
    description: "Shuffles current queue",
    usage: `none`,
    visible: true,
    async execute(client, message, args) {
        if (!message.member.voice.channel) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle('You must be in a voice channel to use this command!') 
                ]
            });
        }
        var player = client.manager.players.get(message.guild.id);
        player.set(`beforeshuffle`, player.queue.map(track => track));
        //shuffle the Queue
        player.queue.shuffle();
        //return success message
        return message.react('🔀').catch((e) => {})
        

    }
}