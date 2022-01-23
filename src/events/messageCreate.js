const prefix = process.env.PREFIX || config.prefix;
const { MessageEmbed } = require("discord.js");

module.exports = async (client, message) => {
    if (message.content.startsWith(prefix) && !message.author.bot && message.guild) {
        const args = message.content.slice(prefix.length).split(" ");
        const command = args.shift().toLowerCase();
        const findcmd = client.commands.get(command) || client.aliases.get(command); //find command or alias
    
        if (findcmd) {
          //if command requires autor to be in voice channel and he's not, return
          if (findcmd.voice) {
            if (!message.member.voice.channel) {
              return message.channel.send({
                embeds: [
                  new MessageEmbed()
                    .setColor(client.ee.wrongcolor)
                    .setTitle("You must be in a voice channel to use this command!"),
                ],
              });
            }
          }
          //if command requires player, pass it to the command
          if (findcmd.player) {
            let player = client.manager.players.get(message.guild.id);
            findcmd.execute(client, message, args, player); //execute the command with the player
          } else {
            findcmd.execute(client, message, args); //execute the command
          }
        }
      }
};