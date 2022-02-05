const Discord = require("discord.js");
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

require("./src/utils/client")(client);

client.logger("Initializing...".def);

// load handlers
Array("events", "commands", "erela", "errorEvent", "loadMongo").forEach((handler) => {
  try {
    require(`./src/utils/handlers/${handler}`)(client);
  } catch (e) {
    console.log(e.stack ? String(e.stack).grey : String(e).grey);
  }
});

client.login(process.env.TOKEN || client.config.token);
