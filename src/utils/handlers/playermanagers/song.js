var { MessageEmbed } = require("discord.js")
var {
  format,
  isValidURL
} = require(`${process.cwd()}/src/utils/functions`)

//function for playling song
async function song(client, message, args, type) {
  var search = args.join(" ");
  var res;
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
  try {
    // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
    if (type.split(":")[1] === "youtube" || type.split(":")[1] === "soundcloud") {
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
      playlist_()
    } else {
      song_()
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

  async function song_() {
    if (!res.tracks[0]) {
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(client.ee.wrongcolor)
          .setTitle(String("Found nothing for: **`" + search).substr(0, 256 - 3) + "`**")
        ]
      }).then(msg => {
        setTimeout(() => {
          msg.delete().catch(() => {})
        }, 3000)
      })
    }
    //if the player is not connected, then connect and create things
    if (player.state !== "CONNECTED") {
      //set the variables
      player.set("message", message);
      player.set("playerauthor", message.author.id);
      //connect
      player.connect();
      //add track
      player.queue.add(res.tracks[0]);
      //play track
      player.play();
      player.pause(false);
    } else if (!player.queue || !player.queue.current) {
      //add track
      player.queue.add(res.tracks[0]);
      //play track
      var playembed = new MessageEmbed()
        .setTitle('Now Playing')
        .setDescription(`**[${res.tracks[0].title}](${res.tracks[0].uri})**`)
        .setThumbnail(res.tracks[0].thumbnail)
        .setColor(client.ee.color)
      message.channel.send({
        embeds: [playembed]
      })

      if (!player.playing && !player.paused && !player.queue.size)
        player.play();
      player.pause(false);
    } else {
      //add the latest track
      player.queue.add(res.tracks[0]);
      //send track information
      var playembed = new MessageEmbed()
        .setTitle('Queued')
        .setDescription(`**[${res.tracks[0].title}](${res.tracks[0].uri})**`)
        .setColor(client.ee.color)
        .setThumbnail(res.tracks[0].thumbnail)
      message.channel.send({
        embeds: [playembed]
      })
    }
  }
  //function ffor playist
  async function playlist_() {
    if (!res.tracks[0]) {
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(client.ee.wrongcolor)
          .setTitle(String("Nothing found for: **`" + search).substr(0, 256 - 3) + "`**")
          .setDescription('No songs were found in the playlist.')
        ]
      }).then(msg => {
        setTimeout(() => {
          msg.delete().catch(() => {})
        }, 3000)
      })
    }
    //if the player is not connected, then connect and create things
    if (player.state !== "CONNECTED") {
      player.set("message", message);
      player.set("playerauthor", message.author.id);
      player.connect();
      //add track
      player.queue.add(res.tracks);
    } else if (!player.queue || !player.queue.current) {
      //add track
      player.queue.add(res.tracks);
      //play track
      player.play();
      player.pause(false);
    } else {
      //add the tracks
      player.queue.add(res.tracks);
    }
    //send information
    var playlistembed = new MessageEmbed()
      .setTitle(`Playlist  **\`${res.playlist.name}`.substr(0, 256 - 3) + "`**" + " added to the Queue")
      .setURL(res.playlist.uri).setColor(client.ee.color)
      .addField("Duration: ", `\`${format(res.playlist.duration)}\``, true)
      .addField("Queue length: ", `\`${player.queue.length} Songs\``, true)
    message.channel.send({
      embeds: [playlistembed]
    })
  }

}

module.exports = song;

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
