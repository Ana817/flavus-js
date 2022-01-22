const guildSettings = require(`${process.cwd()}/src/models/guildSettings`);
const autoplay = require(`${process.cwd()}/src/utils/autoplay`);

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