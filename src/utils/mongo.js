const guildSettings = require(`${process.cwd()}/src/models/guildSettings`);
const playerSave = require(`${process.cwd()}/src/models/playerSave`);
const autoplay = require(`${process.cwd()}/src/utils/autoplay`);

module.exports.getVolume = getVolume;
module.exports.getAutoplay = getAutoplay;
module.exports.getAutoresume = getAutoresume;
module.exports.setAutoresume = setAutoresume;
module.exports.savePlayer = savePlayer;
module.exports.getPlayer = getPlayer;

async function getVolume(player, client) {
    guildSettings.findOne({ guildID: player.options.guild }, (err, settings) => {
        if (err) return client.logger(err);
        if (!settings) return
        player.setVolume(settings.volume);
    });
}

async function getAutoplay(player, client) {
    guildSettings.findOne({ guildID: player.options.guild }, (err, settings) => {
        if (err) return client.logger(err);
        if (!settings) return
        //if settings.autoplay is true, return true else return false
        if (settings.autoplay) autoplay(client, player);
        return
    });
}

async function getAutoresume() {
    return await guildSettings.find({ autoresume: true }).clone();
}

async function setAutoresume(id, boolean) {
    guildSettings.findOne({ guildID: id }, (err, settings) => {
        if (err) return client.logger(err);
        if (!settings) {
            settings = new guildSettings({
                guildID: id,
                autoresume: boolean,
            });
            settings.save().catch((err) => console.log(err));
        } else {
            settings.autoresume = boolean;
            settings.save();
        }
    });
}

async function savePlayer(player, client) {
    let queue = [];
    for (let i = 0; i < player.queue.length; i++) {
        queue.push(player.queue[i]);
    }

    playerSave.findOne({ guildID: player.options.guild }, (err, data) => {
        if (err) client.logger(err);
        if (!data) {
            data = new playerSave({
                guildID: player.options.guild,
                options: {
                    voiceChannel: player.voiceChannel,
                    textChannel: player.textChannel
                },
                queue: queue,
                current: {
                    track: player.queue.current.track,
                    title: player.queue.current.title,
                    identifier: player.queue.current.identifier,
                    author: player.queue.current.author,
                    duration: player.queue.current.duration,
                    isSeekable: player.queue.current.isSeekable,
                    isStream: player.queue.current.isStream,
                    uri: player.queue.current.uri,
                    thumbnail: player.queue.current.thumbnail,
                    position: player.position,
                    paused: player.paused,
                }
            });
            data.save().catch((err) => console.log(err));
        } else {
            data.queue = queue;
            data.current = {
                track: player.queue.current.track,
                title: player.queue.current.title,
                identifier: player.queue.current.identifier,
                author: player.queue.current.author,
                duration: player.queue.current.duration,
                isSeekable: player.queue.current.isSeekable,
                isStream: player.queue.current.isStream,
                uri: player.queue.current.uri,
                thumbnail: player.queue.current.thumbnail,
                position: player.position,
                paused: player.paused,
            };
            data.date = Date.now();
            data.save().catch((err) => console.log(err));
        }
    });
}

async function getPlayer(id, client) {
    //find saved player with guildID
    return await playerSave.findOne({ guildID: id }).clone();
}