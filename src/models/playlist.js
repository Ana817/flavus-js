const { Schema, model } = require('mongoose');

const playlist = Schema({
    id: String,
    author: String,
    name: String,
    default: Boolean,
    public: Boolean,
    tracks: {
        type: Array,
        default: [],
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('playlist', playlist);
playlist.set('autoIndex', false);