var { MessageEmbed } = require("discord.js")
const Discord = require("discord.js");

module.exports = playtop;
async function playtop(client, message, args, type) {
  const search = args.join(" ");
  var player = client.manager.players.get(message.guild.id);
  //if no node, connect it 
  if (player && player.node && !player.node.connected) await player.node.connect()
  //if no player create it
  if (!player) {
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
  let res;
  res = await client.manager.search({
    query: search,
    source: type.split(":")[1]
  }, message.author);
  // Check the load type as this command is not that advanced for basics
  if (res.loadType === "LOAD_FAILED") throw res.exception;
  else if (res.loadType === "PLAYLIST_LOADED") {
    playlist_()
  } else {
    song_()
  }
  async function song_() {
    //if no tracks found return info msg

    if (!res.tracks[0]) {
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(client.ee.wrongcolor)
          .setTitle(String("Found nothing for: **`" + search).substr(0, 256 - 3) + "`**")
        ]
      }).catch(() => {}).then(msg => {
        setTimeout(() => {
          msg.delete().catch(() => {})
        }, 3000)
      })
    }
    //if the player is not connected, then connect and create things
    if (state !== "CONNECTED") {
      //set the variables
      player.set("message", message);
      player.set("messageid", message.id);
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
        .setColor(client.ee.color)
      message.channel.send({
        embeds: [playembed]
      })

      if (!player.playing && !player.paused && !player.queue.size)
        player.play();
      player.pause(false);
    } else {
      //save old tracks on an var
      let oldQueue = []
      for (const track of player.queue)
        oldQueue.push(track);
      //clear queue
      player.queue.clear();
      //add new tracks
      player.queue.add(res.tracks[0]);
      //now add every old song again
      for (const track of oldQueue)
        player.queue.add(track);
    }
    //send track information
    var playembed = new MessageEmbed()
    .setTitle('Queued')
    .setDescription(`**[${res.tracks[0].title}](${res.tracks[0].uri})**`)
    .setColor(client.ee.color)
    message.channel.send({
      embeds: [playembed]
    }).catch(() => {});
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
      }).catch(() => {}).then(msg => {
        setTimeout(() => {
          msg.delete().catch(() => {})
        }, 3000)
      })
    }
    //if the player is not connected, then connect and create things
    if (state !== "CONNECTED") {
      player.set("message", message);
      player.set("playerauthor", message.author.id);
      player.connect();
      //add track
      player.queue.add(res.tracks);
      //play track
      player.play();
    } else if (!player.queue || !player.queue.current) {
      //add track
      player.queue.add(res.tracks);
      //play track
      player.play();
    } else {
      //save old tracks on an var
      let oldQueue = []
      for (const track of player.queue)
        oldQueue.push(track);
      //clear queue
      player.queue.clear();
      //add new tracks
      player.queue.add(res.tracks);
      //now add every old song again
      for (const track of oldQueue)
        player.queue.add(track);
    }
    var time = 0;
    let playlistembed = new Discord.MessageEmbed()
      .setColor(client.ee.color)
      .setTitle(`Playlist  **\`${res.playlist.name}`.substr(0, 256 - 3) + "`**" + " added to the Queue")
      .setURL(res.playlist.uri).setColor(client.ee.color)
    //timing for estimated time creation
    if (player.queue.size > 0) player.queue.map((track) => time += track.duration)
    time += player.queue.current.duration - player.position;
    for (const track of res.tracks)
      time -= track.duration;
    playlistembed.addField("Enqueued", `\`${res.tracks.length}\``, true)
    //if bot allowed to send embed, do it otherwise pure txt msg
    if (message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS")) {
      message.channel.send({
        embeds: [playlistembed]
      }).catch(() => {});
    } else {
      message.channel.send({
        content: [eval(client.la[ls]["handlers"]["playermanagers"]["playtop"]["variable6"])]
      }).catch(() => {});
    }

  }
}
