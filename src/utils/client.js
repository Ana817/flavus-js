const colors = require("colors");
const Genius = require("genius-lyrics");
const config = require(`${process.cwd()}/config.json`);
const { MessageEmbed } = require("discord.js");
const { DiscordTogether } = require("discord-together");

module.exports = client => {

    client.config = config;
    client.embed = config.visuals.embed;
    client.toTime = require("to-time");
    client.discordTogether = new DiscordTogether(client); // Discord Together

    if (process.env.GENIUS) {
        client.lyrics = new Genius.Client(process.env.GENIUS);
    } else {
        client.lyrics = new Genius.Client();
    }

    client.setMaxListeners(50); // Max listeners
    require("events").defaultMaxListeners = 50;

    colors.setTheme({
      def: "grey",
      log: "brightGreen",
      warn: "yellow",
      debug: "brightBlue",
      error: "brightRed",
    });

    client.logger = (data) => {
      let logstring = `${`${new Date().toLocaleString()}`.cyan}${` |`.grey}`
      if (typeof data == "string") {
        console.log(logstring, data.split("\n").map(d => `${d}`.green).join(`\n${logstring} `))
      } else if (typeof data == "object") {
        console.log(logstring, JSON.stringify(data, null, 3).green)
      } else if (typeof data == "boolean") {
        console.log(logstring, String(data).cyan)
      } else {
        console.log(logstring, data)
      }
    };

    client.error = (string) => {
      let embed = new MessageEmbed()
        .setColor(client.embed.wrongcolor)
        .setTitle(string)
      let message = { embeds: [embed] }
      return message;
    }
}