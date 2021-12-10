const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "ping",
    aliases: ["png"],
    description: "Debug",
    usage: `none`,
    visible: false,
    async execute(client, message, args) {
        return message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(client.ee.wrongcolor)
            .setTitle(`\`\`\`Testing codeblock inside embed\nso this should do domething\`\`\``) 
            ]
        });

    }
}