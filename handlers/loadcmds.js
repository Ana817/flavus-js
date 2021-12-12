const Discord = require("discord.js");
const fs = require("fs");

module.exports = (client) => {
  try {
    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    client.info = new Discord.Collection();

    fs.readdir(`./commands/`, (error, files) => {
      if (error) {
        return client.clog("Error while trying to get the commmands!".error);
      }
      files.forEach((file) => {
        try {
          delete require.cache[require.resolve(`../commands/${file}`)];
          const command = require(`../commands/${file}`);
          const commandName = file.split(".")[0];

          if (!command.execute) return client.clog(`Command `.error + `${commandName}`.warn + ` has no execute function!`.error);
          if (!command.name) return client.clog(`Command `.error + `${commandName}`.warn + ` has no name!`.error);

          client.commands.set(command.name, command);

          if (command.aliases) {
            command.aliases.forEach((alias) => {
              client.aliases.set(alias, command);
            });
          }
        } catch (e) {
          return client.clog(String(e.stack).error);
        }
      });
      client.clog(`${client.commands.size} commands loaded!`.log);
    });
  } catch (e) {
    client.clog(String(e.stack).error);
  }
};
