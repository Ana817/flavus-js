const Discord = require("discord.js");
const colors = require("colors");
const toTime = require('to-time');
colors.setTheme({
    def: 'grey',
    log: 'brightGreen',
    warn: 'yellow',
    debug: 'brightBlue',
    error: 'brightRed'
});
const fs = require("fs");
const config = require("./config/config.json")
const clog = require("./utils/logger.js");
require('dotenv').config();

const client = new Discord.Client({
  fetchAllMembers: false,
  failIfNotExists: false,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
  intents: [ 
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  presence: {
    status: "dnd"
  }
});
const { DiscordTogether } = require('discord-together');
client.discordTogether = new DiscordTogether(client);
client.toTime = toTime;


client.config = config;
client.clog = clog
client.ee = config.visuals.embed
client.clog('Initializing...'.def);

//Raise max listeners from default of 10 to 25
client.setMaxListeners(25);
require('events').defaultMaxListeners = 25;

Array(
  "loadcmds", "erela", "extraevents", "loadMongo"
).forEach(handler => {
  try{ require(`./handlers/${handler}`)(client); }catch (e){ console.log(e.stack ? String(e.stack).grey : String(e).grey) }
});

client.on("ready", () => {
  client.clog(`${client.user.tag} is ready!`.log);
});

client.on('messageCreate', async (msg) => {
    if (msg.content.startsWith(process.env.prefix) && !msg.author.bot && msg.guild) { //check if the message starts with the prefix and if the message is not from a bot
        const args = msg.content.slice(config.prefix.length).split(" ");
        const command = args.shift().toLowerCase();
        const findcmd = client.commands.get(command) || client.aliases.get(command); //find command or alias
        
        if (findcmd) {
            findcmd.execute(client, msg, args);    
        }
    }
});

client.on("raw", (d) => client.manager.updateVoiceState(d));

//login
client.login(process.env.token || config.token);