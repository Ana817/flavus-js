const { Schema, model } = require("mongoose");

const playerSave = Schema({
  guildID: String,
  options: {
    voiceChannel: String,
    textChannel: String,
  },
  queue: [
    {
      track: String,
      title: String,
      identifier: String,
      author: String,
      duration: Number,
      isSeekable: Boolean,
      isStream: Boolean,
      uri: String,
      thumbnail: String,
    }
  ],
  current: {
    track: String,
    title: String,
    identifier: String,
    author: String,
    duration: Number,
    isSeekable: Boolean,
    isStream: Boolean,
    uri: String,
    thumbnail: String,
    position: Number,
    paused: Boolean,
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = model("playerSave", playerSave);
playerSave.set("autoIndex", false);
