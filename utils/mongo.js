const guildSettings = require('../models/guildSettings');
var { autoplay } = require(`${process.cwd()}/utils/functions`);

module.exports.getVolume = getVolume;
module.exports.getAutoplay = getAutoplay;

async function getVolume(player, client) {
    guildSettings.findOne({ guildID: player.options.guild }, (err, settings) => {
        if (err) return client.clog(err);
        if (!settings) return
        player.setVolume(settings.volume);
    });
}

async function getAutoplay(player, client) {
    guildSettings.findOne({ guildID: player.options.guild }, (err, settings) => {
        if (err) return client.clog(err);
        if (!settings) return
        //if settings.autoplay is true, return true else return false
        if (settings.autoplay) autoplay(client, player);
        return
    });
}