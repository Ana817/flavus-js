const { Schema, model } = require("mongoose");

const guildSettings = Schema({
  guildID: String,
  volume: {
    type: Number,
    default: undefined,
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("guildSettings", guildSettings);
guildSettings.set("autoIndex", false);
