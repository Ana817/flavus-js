const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["?"],
  description: "Shows all avalible commands, or help for a specific command",
  usage: `\`<prefix>help\` or \`<prefix>help <command>\``,
  execute(client, msg, args) {
    if (args[0]) { // if there is an argument, show help for that command
      const cmd = client.commands.get(args[0]) || client.aliases.get(args[0]);
      if (cmd) {
        const embed = new MessageEmbed()
          .setColor(client.ee.color)
          .setTitle(`${cmd.name[0].toUpperCase()}${cmd.name.slice(1)}`)
        if(cmd.info) {
          descriptionString = `${cmd.description}\n\n${cmd.info}`
          embed.setDescription(`${descriptionString}`);
        } else {
          embed.setDescription(`${cmd.description}`);
        }
        if (cmd.usage) {
          embed.addField("Usage", `${cmd.usage.replace(/<prefix>/g, process.env.PREFIX)}`);
        }
        if (cmd.aliases) embed.addField("Aliases", `\`${cmd.aliases.join(", ")}\``);
        msg.channel.send({ embeds: [embed] });
      } else {
        msg.channel.send(`Command \`${args[0]}\` not found`);
      }
    } else {
      const helpEmbed = new MessageEmbed()
        .setColor(client.ee.color)
        .setTitle("HELP")
        .setDescription(
          `${process.env.prefix}help (cmd name), display the help for a specific command`
        );

      for (let [key, value] of client.commands) {
        //loop through all commands
        if (value.visible) helpEmbed.addField(`${value.name[0].toUpperCase()}${value.name.slice(1)}`, value.description); //add the command name and description to the embed
      }
      msg.channel.send({ embeds: [helpEmbed] });
    }
  },
};
