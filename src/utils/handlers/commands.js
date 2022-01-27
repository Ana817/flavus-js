const Discord = require("discord.js");
const fs = require("fs");
const config = require(`${process.cwd()}/config.json`);

module.exports = (client) => {
    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    client.info = new Discord.Collection();

    //load all .js files from all subdirectories of src/commands
    try {
      fs.readdirSync(`${process.cwd()}/src/commands`).forEach((dir) => {
        let files = fs.readdirSync(`${process.cwd()}/src/commands/${dir}/`).filter((file) => file.endsWith(".js"));
        files.forEach((file) => {
          try {
            delete require.cache[require.resolve(`${process.cwd()}/src/commands/${dir}/${file}`)];
            const command = require(`${process.cwd()}/src/commands/${dir}/${file}`);
            const commandName = file.split(".")[0];
  
            if (!command.execute) return client.logger(`Command `.error + `${commandName}`.warn + ` has no execute function!`.error);
            if (!command.name) return client.logger(`Command `.error + `${commandName}`.warn + ` has no name!`.error);
  
            client.commands.set(command.name, command);
  
            if (command.aliases) {
              command.aliases.forEach((alias) => {
                client.aliases.set(alias, command);
              });
            }
          } catch (e) {
            return client.logger(String(e.stack).error);
          }
        });
      });
      client.logger(`${client.commands.size} commands loaded!`.log);
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
    }
    
};
