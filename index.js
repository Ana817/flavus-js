const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { DiscordTogether } = require("discord-together");
const config = require("./config/config.json");
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

// append some stuff to the client
client.discordTogether = new DiscordTogether(client); // Discord Together
client.toTime = require("to-time");
client.config = config;
client.ee = config.visuals.embed;
client.clog = require("./utils/logger.js");
client.error = require(`./utils/error.js`);

const prefix = process.env.PREFIX || config.prefix;

client.setMaxListeners(25); // Max listeners
require("events").defaultMaxListeners = 25;

client.clog("Initializing...".def);

// load handlers
Array("loadcmds", "erela", "extraevents", "loadMongo").forEach((handler) => {
  try {
    require(`./handlers/${handler}`)(client);
  } catch (e) {
    console.log(e.stack ? String(e.stack).grey : String(e).grey);
  }
});

client.on("ready", () => {
  client.clog(`${client.user.tag} is ready!`.log);
});

client.on("messageCreate", async (msg) => {
  // check if the message starts with the prefix and if the message is not from a bot
  if (msg.content.startsWith(prefix) && !msg.author.bot && msg.guild) {
    const args = msg.content.slice(prefix.length).split(" ");
    const command = args.shift().toLowerCase();
    const findcmd = client.commands.get(command) || client.aliases.get(command); //find command or alias

    if (findcmd) {
      //if command requires autor to be in voice channel and he's not, return
      if (findcmd.voice) {
        if (!msg.member.voice.channel) {
          return msg.channel.send({
            embeds: [
              new MessageEmbed()
                .setColor(client.ee.wrongcolor)
                .setTitle("You must be in a voice channel to use this command!"),
            ],
          });
        }
      }
      //if command requires player, pass it to the command
      if (findcmd.player) {
        let player = client.manager.players.get(msg.guild.id);
        findcmd.execute(client, msg, args, player); //execute the command with the player
      } else {
        findcmd.execute(client, msg, args); //execute the command
      }
    }
  }
});

client.on("raw", (d) => client.manager.updateVoiceState(d)); // update voice state

client.login(process.env.token || config.token);
