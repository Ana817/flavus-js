const guildSettings = require(`${process.cwd()}/src/models/guildSettings`);

module.exports = {
  name: "autoplay",
  description: "Toggle autoplay",
  visible: true,
  async execute(client, message) {
    guildSettings.findOne({ guildID: message.guild.id }, (err, settings) => { // try to find the guild settings
      if (err) return client.logger(err); // if there is an error, log it
      if (!settings) { // if there are no settings, create them
        settings = new guildSettings({
          guildID: player.options.guild,
          autoplay: true,
        });
        settings.save().catch((err) => console.log(err));
        return message.react("👌").catch((e) => {});
      } else { // if there are settings, toggle autoplay
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
