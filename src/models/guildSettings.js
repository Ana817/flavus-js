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
  autoresume: {
    type: Boolean,
    default: false,
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = model("guildSettings", guildSettings);
guildSettings.set("autoIndex", false);
