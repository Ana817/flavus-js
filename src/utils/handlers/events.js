const fs = require('fs');

module.exports = async (client) => {
    fs.readdir(`${process.cwd()}/src/events`, (err, files) => {
        if (err) client.logger(err);
        files = files.filter(f => f.split(".").pop() === "js");
        files.forEach(file => {
            const event = require(`${process.cwd()}/src/events/${file}`);
            let eventName = file.split(".")[0];
            client.on(eventName, event.bind(null, client));
        });
        client.logger(`${files.length} events loaded!`.log);
    });
}