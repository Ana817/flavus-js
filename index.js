const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { DiscordTogether } = require("discord-together");
const config = require("./config.json");
const Genius = require("genius-lyrics");
require("dotenv").config();

const client = new Discord.Client({
  fetchAllMembers: false,
  failIfNotExists: false,
  partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  presence: {
    status: "dnd",
  },
});
if (process.env.GENIUS) {
  client.lyrics = new Genius.Client(process.env.genius);
} else {
  client.lyrics = new Genius.Client();
}

client.discordTogether = new DiscordTogether(client); // Discord Together
client.toTime = require("to-time");
client.config = config;
client.ee = config.visuals.embed;
client.clog = require("./src/utils/logger.js");
client.error = require("./src/utils/error.js");

const prefix = process.env.PREFIX || config.prefix;

client.setMaxListeners(25); // Max listeners
require("events").defaultMaxListeners = 25;

client.clog("Initializing...".def);

// load handlers
Array("events", "commands", "erela", "errorEvent", "loadMongo").forEach((handler) => {
  try {
    require(`./src/utils/handlers/${handler}`)(client);
  } catch (e) {
    console.log(e.stack ? String(e.stack).grey : String(e).grey);
  }
});

client.login(process.env.token || config.token);
