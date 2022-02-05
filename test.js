const Collection = require('discord.js').Collection;
const { EventEmitter } = require("events");

let Database = new Collection();

let databasing = new EventEmitter();


databasing.emit('set', "test", "test");

// event listener
databasing.on('set', (key, value) => {
    console.log(`The value of ${key} is set to ${value}`);
});

databasing.on('get', (key, value) => {
    console.log(`The value of ${key} is ${value}`);
});