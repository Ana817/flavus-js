var {
  MessageEmbed
} = require("discord.js")
var {
  format,
  isValidURL
} = require(`${process.cwd()}/utils/functions`)

//function for playling song
async function similar(client, message, args, type) {
  let mixURL
  let res
  var player = client.manager.players.get(message.guild.id);
  //if no node, connect it 
  if (player && player.node && !player.node.connected) await player.node.connect()
  //if no player create it
  if (!player) {
    if (!message.member.voice.channel) throw "NOT IN A VC"
    player = await client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: true,
    });
    if (player && player.node && !player.node.connected) await player.node.connect()
    player.set("messageid", message.id);
  }
  let state = player.state;
  if (state !== "CONNECTED") {
    //set the variables
    player.set("message", message);
    player.set("playerauthor", message.author.id);
    player.connect();
    player.stop();
  }
  let count = null
  if (args[0]) {
    if (args[args.length - 1].match("^<.*>$")) {
      //remove first and last character from args[args.length - 1]
      let num = args[args.length - 1].substring(1, args[args.length - 1].length - 1)
      if (!isNaN(num)) count = num
      args.pop()
    }
  }
  if (args[0]) {
    args_()
  } else {
    current_()
  }
  

  async function args_() {
    var search = args.join(" ");
    try {
      // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
      if (type.split(":")[1] === "youtube") {
        if (isValidURL(search)) {
          res = await client.manager.search(search, message.author);
        } else {
          res = await client.manager.search({
            query: search,
            source: type.split(":")[1]
          }, message.author);
        }
      } else {
        res = await client.manager.search(search, message.author);
      }
      // Check the load type as this command is not that advanced for basics
      if (res.loadType === "LOAD_FAILED") throw res.exception;
      else if (res.loadType === "PLAYLIST_LOADED") {
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor(client.ee.wrongcolor)
            .setTitle(`Url can't be playlist!`)
          ]
        })
      } else {
        if (!res.tracks[0]) {
          return message.channel.send({
            embeds: [new MessageEmbed()
              .setColor(client.ee.wrongcolor)
              .setTitle(`No results found!`)
            ]
          })
        } else {
          mixURL = `https://www.youtube.com/watch?v=${res.tracks[0].identifier}&list=RD${res.tracks[0].identifier}`;
          mix_()
        }
      }
    } catch (e) {
      console.log(e)
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(client.ee.wrongcolor)
          .setTitle(String("There was an Error while searching: `" + search).substr(0, 256 - 3) + "`**")
          .setDescription(`\`\`\`${e}\`\`\``.substr(0, 2000))
        ]
      });
    }
  }

  async function current_() {
    const previoustrack = player.get(`previousTrack`)
    if (!previoustrack) {
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(client.ee.wrongcolor)
          .setTitle(`No arguments provided!`)
        ]
      })
    } else {
      //set res.tracks[0].identifier to current track identifier
      res = {
        tracks: [{
          identifier: previoustrack.identifier
        }]
      }
      mixURL = `https://www.youtube.com/watch?v=${previoustrack.identifier}&list=RD${previoustrack.identifier}`;
      mix_()
    }

  }

  async function mix_() {
    try {
      const response = await client.manager.search(mixURL, message.author);
      //if nothing is found, send error message, plus if there  is a delay for the empty QUEUE send error message TOO
      if (!response || response.loadType === 'LOAD_FAILED' || response.loadType !== 'PLAYLIST_LOADED') {
        const embed = new MessageEmbed()
          .setTitle("Error")
          .setDescription(`Couldn't add mix to queue!`)
          .setColor(0xFF0000);
        client.channels.cache.get(player.textChannel).send({ embeds: [embed] }).catch(() => { });
        return;
      }
      //remove every track from response.tracks that has the same identifier as the previous track
      response.tracks = response.tracks.filter(track => track.identifier !== res.tracks[0].identifier);
      //if there are no tracks left in the response, send error message
      if (!response.tracks.length) {
        const embed = new MessageEmbed()
          .setTitle("Error")
          .setDescription(`No similar tracks found!`)
          .setColor(0xFF0000);
        client.channels.cache.get(player.textChannel).send(embed).catch(() => { });
        return;
      }
      let track
      if (count) {
        if (Number(count) > response.tracks.length) count = response.tracks.length
        let random = response.tracks.sort(() => Math.random() - 0.5);
        track = random.slice(0, Number(count));
      } else {
        track = [response.tracks[Math.floor(Math.random() * Math.floor(response.tracks.length))]]
      }
      if (player.state !== "CONNECTED") {
        player.set("message", message);
        player.set("playerauthor", message.author.id);
        player.connect();
        //add track
        player.queue.add(track);
      } else if (!player.queue || !player.queue.current) {
        //add track
        player.queue.add(track);
        //play track
        player.play();
        player.pause(false);
      } else {
        player.queue.add(track);
      }
      //if track has more than 1 track
      if (track.length == 1) {
        const embed = new MessageEmbed()
          .setTitle("Added similar track to queue")
          .setDescription(`[${track[0].title}](${track[0].uri})`)
          .setColor(client.ee.color)
          .setThumbnail(track[0].thumbnail);
        message.channel.send({ embeds: [embed] }).catch(() => { });
      } else {
        let duration = 0;
        track.forEach(t => {
          duration += t.duration
        })
        const embed = new MessageEmbed()
          .setTitle(`Added ${track.length} similar tracks to queue`)
          .setDescription(`First of them - [${track[0].title}](${track[0].uri})`)
          .addField("Duration: ", `\`${format(duration)}\``, true)
          .addField("Queue length: ", `\`${player.queue.length} Songs\``, true)
          .setColor(client.ee.color)
          .setThumbnail(track[0].thumbnail);
        message.channel.send({ embeds: [embed] }).catch(() => { });
      }

      
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
    }
  }
}



module.exports = similar;
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
