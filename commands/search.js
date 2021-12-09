const { MessageEmbed } = require('discord.js');
const ee = require(`${process.cwd()}/config/embed.json`)
const playermanager = require(`${process.cwd()}/handlers/playermanager`);

module.exports = {
    name: "search",
    aliases: ["sr"],
    description: "Seach for track",
    usage: `none`,
    visible: true,
    async execute(client, message, args) {
        if (!args[0])
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle('No arguments provided!')
            ]
        });
        playermanager(client, message, args, `search:youtube`);
    }
}