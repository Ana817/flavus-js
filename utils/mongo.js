const guildSettings = require('../models/guildSettings');

module.exports.getVolume = getVolume;

async function getVolume(player, client) {
    guildSettings.findOne({ guildID: player.options.guild }, (err, settings) => {
        if (err) return client.clog(err);
        if (!settings) return
        player.setVolume(settings.volume);
    });
}