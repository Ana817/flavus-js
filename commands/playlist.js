const { MessageEmbed } = require("discord.js");
const playlist = require('../models/playlist');
const { MessageActionRow, MessageButton } = require("discord.js");
const {
  TrackUtils
} = require("erela.js");
const main = require("lyrics-finder");

module.exports = {
  name: "playlist",
  aliases: ["pl"],
  description: "Creates, manages and loads playlists",
  info: "",
  usage: `\`<prefix>playlist create <name>\` - creates playlist\n\`<prefix>pl <name>\` - loads playlist\n\`<prefix>pl list\` - lists all playlists\n\`<prefix>pl add <np|queue>\` - adds current track or queue to playlist\n\`<prefix>pl delete <name>\` - deletes playlist`,
  visible: true,
  player: true,
  async execute(client, message, args, player) {
    if (!args[0]) {
      return message.channel.send(client.error("No arguments provided!"));
    }
    switch (args[0]) {

      case "create":
        create(client, message, args, player);
      break;

      case "list":
        list(client, message, args, player);
        //todo
      break;

      default:
        let plist = await playlist.findOne({ id: message.author.id, name: args[0] }).clone();
        if (!plist) return message.channel.send(client.error(`You don't have playlist called ${args[0]}!`));
        handlePlaylist(client, message, args, player, plist);
      break;
    }
    return
  },
};

async function handlePlaylist(client, message, args, player, plist) {
  if (!args[1]) {
    play(client, message, args, player, plist);
  }
  switch (args[1]) {
    case "add":
      add(client, message, args, player, plist);
    break;
    case "delete": case "del": case "remove": case "rm":
      deletePlaylist(client, message, args, player);
    break;
    default:
      //@todo
    break
  }
  return
}

async function create(client, message, args, player) {
  let failed = false;
  if (!args[1]) {
    return message.channel.send(client.error("Please specify playlist name!"));
  }
  if (args[1].length > 20) {
    return message.channel.send(client.error("Playlist name must be under 20 characters!"));
  }
  if (args[1] == "create" || args[1] == "list") return message.channel.send(client.error("Invalid playlist name!"));
  await playlist.findOne({ id: message.author.id, name: args[1] }, (err, plist) => {
    if (err) console.log(err);
    if (plist) {
      failed = true;
    }
  }).clone();
  if (failed) return message.channel.send(client.error(`You already have playlist called ${args[1]}!`));
  playlist.create({
      id: message.author.id,
      author: message.author.username,
      name: args[1],
      default: false,
      public: false,
  }, (err, plist) => {
      if (err) console.log(err);
      //@todo embed
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Playlist \`${args[1]}\` created!`)
            .setDescription(`@todo - add desription`)
            .setColor(client.ee.color),
        ],
      });
  });
  return
}

async function edit() {
  //todo
}

async function list(client, message, args, player) {
  playlist.find({ id: message.author.id }, (err, plist) => {
      if (err) console.log(err);
      if (!plist | plist.length == 0) {
          return message.channel.send(client.error(`You don't have any playlist!`));
      } else {
        let i = 1;
          message.channel.send({
            embeds: [
              new MessageEmbed()
                .setTitle(`Playlist list - \`${message.author.tag}\``)
                .setDescription(`${plist.map(pl => `${i++} - \`${pl.name}\``).join('\n')}`)
                .setColor(client.ee.color),
            ],
          });
      }
  })
}

async function add(client, message, args, player, plist) {
    switch (args[2]) {

      case "np":
        if (!player) return message.channel.send(client.error("Nothing is playing!"));
        const track = player.queue.current;
        if (!track) return message.channel.send(client.error("No track playing!"));
        plist.tracks.push({
          "title": track.title,
          "url": track.uri,
          "duration": track.duration,
        });
        plist.save();
        message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle(`Current track added to playlist - \`${plist.name}\``)
              .setColor(client.ee.color),
          ],
        });
      break

      case "queue": case "q":
        if (!player) return message.channel.send(client.error("Nothing is playing!"));
        const tracks = player.queue
        const newtracks = [];

        for (const track of tracks)
          newtracks.push({
            "title": track.title,
            "url": track.uri,
            "duration": track.duration,
          });

        if (player.queue.current) newtracks.unshift({
          "title": player.queue.current.title,
          "url": player.queue.current.uri,
          "duration": player.queue.current.duration,
        });
        if (newtracks.length == 0) return message.channel.send(client.error("No tracks in queue!"));

        plist.tracks = plist.tracks.concat(newtracks);
        plist.save();

        message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle(`\`${newtracks.length}\` tracks added to playlist - \`${plist.name}\``)
              .setColor(client.ee.color),
          ],
        });
      break;

    }
  return
}

async function info(client, message, args, player) {
  if (!args[1]) {
    return message.channel.send(client.error("Please specify playlist name!"));
  }
  playlist.findOne({ id: message.author.id, name: args[1] }, (err, plist) => {
    if (err) console.log(err);
    if (!plist) {
      return message.channel.send(client.error(`You don't have playlist called ${args[1]}!`));
    }
    console.log(player.queue)
  })
}

async function play(client, message, args, player, plist) {
  if (!message.member.voice.channel) return message.channel.send(client.error("You must be in a voice channel!"));
  if (plist.tracks.length == 0) return message.channel.send(client.error(`Playlist \`${plist.name}\` is empty!`));
  let playercreate = false;
  if (!player) {
    player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: true,
    });
    player.connect();
    player.set("message", message);
    player.set("playerauthor", message.author.id);
    playercreate = true;
  }
  for (const track of plist.tracks) {
    try {
      const resolved = TrackUtils.buildUnresolved({
        title: track.title,
        uri: track.url,
        duration: track.duration,
      }, message.author);
      player.queue.add(resolved);
    } catch (e) {
      console.log(e);
    }
  }
  message.channel.send({
    embeds: [
      new MessageEmbed()
        .setTitle(`Loaded playlist - \`${plist.name}\` - \`${plist.tracks.length}\` tracks`)
        .setColor(client.ee.color),
    ],
  })
  if (playercreate) player.play();
}

async function deletePlaylist(client, message, args, player) {
  const tempmessage = await message.channel.send({
    embeds: [
      new MessageEmbed()
        .setTitle(`Are you sure you want to delete playlist \`${args[1]}\`?`)
        .setColor(client.ee.wrongcolor),
    ],
    components: [new MessageActionRow().addComponents(
      (but_1 = new MessageButton().setCustomId("no").setStyle("SUCCESS").setLabel("NO")),
      (but_2 = new MessageButton().setCustomId("yes").setStyle("DANGER").setLabel("YES")),
    )],
  })

  const collector = message.channel.createMessageComponentCollector({ // create collector for buttons
    time: 30000,
  });

  collector.on("collect", async (button) => {
    collector.stop();
    if (button.message.id !== tempmessage.id || button.user.id !== message.author.id ) return await button.deferUpdate();
    console.log(button)
    if (button.customId == "no") {
      await button.deferUpdate()
      //return tempmessage.delete();
    } else if (button.customId == "yes") {
      await button.deferUpdate()
      await playlist.deleteOne({ id: message.author.id, name: args[0] });
      //await tempmessage.delete();
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Playlist \`${args[0]}\` deleted!`)
            .setColor(client.ee.color),
        ],
      });
    }
  })
  collector.on("end", async (button) => {
    return tempmessage.delete()
  });
}