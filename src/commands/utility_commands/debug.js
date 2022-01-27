const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
var { savePlayer } = require(`${process.cwd()}/src/utils/mongo`);
const guildSettings = require(`${process.cwd()}/src/models/guildSettings`);

module.exports = {
  name: "debug",
  description: "Debug command",
  usage: `none`,
  player: true,
  visible: false,
  async execute(client, message, args, player) {

    console.log(player.queue.current);
    //savePlayer(player, client);

    /*

    guildSettings.findOne({ guildID: message.guild.id }, (err, settings) => { // try to find the guild settings
      if (err) return client.logger(err); // if there is an error, log it
      if (!settings) { // if there are no settings, create them
        settings = new guildSettings({
          guildID: message.guild.id,
          autoresume: true,
        });
        settings.save().catch((err) => console.log(err));
        return message.react("👌").catch((e) => {});
      } else { // if there are settings, toggle autoplay
        settings.autoresume = !settings.autoresume;
        settings.save().catch((err) => console.log(err));
        if (settings.autoresume) {
          return message.react("👌").catch((e) => {});
        } else {
          return message.react('❌').catch((e) => {})
        }
      }
    });
    */
  },
};
