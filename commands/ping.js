const { MessageEmbed } = require('discord.js');
const ee = require(`${process.cwd()}/config/embed.json`)

module.exports = {
    name: "ping",
    aliases: ["png"],
    description: "Debug",
    usage: `none`,
    visible: false,
    async execute(client, message, args) {
        return message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(`\`\`\`Testing codeblock inside embed\nso this should do domething\`\`\``) 
            ]
        });

    }
}