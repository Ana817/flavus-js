const guildSettings = require("../models/guildSettings");

module.exports = {
  name: "autoplay",
  aliases: [],
  description: "Toggle autoplay",
  usage: `none`,
  visible: true,
  async execute(client, message) {
    guildSettings.findOne({ guildID: message.guild.id }, (err, settings) => {
      if (err) return client.clog(err);
      if (!settings) {
        settings = new guildSettings({
          guildID: player.options.guild,
          autoplay: true,
        });
        settings.save().catch((err) => console.log(err));
        return message.react("👌").catch((e) => {});
      } else {
        settings.autoplay = !settings.autoplay;
        settings.save().catch((err) => console.log(err));
        if (settings.autoplay) {
          return message.react("👌").catch((e) => {});
        } else {
          return message.react('❌').catch((e) => {})
        }
      }
    });
  },
};
