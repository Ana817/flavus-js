const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "help",
    aliases: ["?"],
    description: "Shows all avalible commands",
    execute(client, msg, args) {
        if (args[0]) { //check if there are any args
            const cmd = client.commands.get(args[0]) || client.aliases.get(args[0]);
            if (cmd) {
                const embed = new MessageEmbed()
                    .setColor(0x00AE86)
                    .setTitle(`${cmd.name}`)
                    .addField("Description", `${cmd.description}`);
                    if (cmd.usage) embed.addField("Usage", `\`${client.config.prefix}${cmd.usage}\``);
                    if (cmd.aliases) embed.addField("Aliases", `\`${cmd.aliases.join(", ")}\``);
                msg.channel.send({ embeds: [embed] });
            } else {
                msg.channel.send(`Command \`${args[0]}\` not found`);
            }
        } else {
            const helpEmbed = new MessageEmbed()
            .setColor(client.ee.color)
            .setTitle('HELP')
            .setDescription(`${client.config.prefix}help (cmd name), display the help for a specific command`)

            for (let [key, value] of client.commands) { //loop through all commands
                if (value.visible) helpEmbed.addField(value.name, value.description) //add the command name and description to the embed
            }
            msg.channel.send({ embeds: [helpEmbed] });
        }
    }
};