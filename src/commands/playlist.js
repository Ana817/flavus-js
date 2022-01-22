const playlist = require(`${process.cwd()}/src/models/playlist`);
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require("discord.js");
var { createPlaylistEmbed } = require(`${process.cwd()}/src/utils/functions`);
const { TrackUtils } = require("erela.js");

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
    case "info": case "show": case "edit": case "view":
      info(client, message, args, player, plist);
    break;
    case "rename": case "ren":
      rename(client, message, args, player, plist);
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
          "isStream": track.isStream,
          "thumbnail": track.thumbnail,
          "identifier": track.identifier,
          "author": track.author,
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
            "isStream": track.isStream,
            "thumbnail": track.thumbnail,
            "identifier": track.identifier,
            "author": track.author,
          });

        if (player.queue.current) newtracks.unshift({
          "title": player.queue.current.title,
          "url": player.queue.current.uri,
          "duration": player.queue.current.duration,
          "isStream": player.queue.current.isStream,
          "thumbnail": player.queue.current.thumbnail,
          "identifier": player.queue.current.identifier,
          "author": player.queue.current.author,
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

async function info(client, message, args, player, plist) {
  let buttons = new MessageActionRow().addComponents(
    (but_1 = new MessageButton().setCustomId("id_1").setEmoji("⬅️").setStyle("SECONDARY").setDisabled(true)),
    (but_2 = new MessageButton().setCustomId("id_2").setEmoji("➡️").setStyle("SECONDARY")),
    (but_3 = new MessageButton().setCustomId("id_3").setLabel("EDIT").setStyle("PRIMARY")),
  );
  let menu
  let row = [buttons]
  let editmode = false;
  let requester = message.author.id;
  message.channel.send({ embeds: [createPlaylistEmbed(plist, 0)] })
  .then((message) => {
    const tracks = plist.tracks
    if (tracks.length <= 15) {
      buttons.components[1].setDisabled(true)
    }
    message.edit({
      components: row,
    });
    const collector = message.channel.createMessageComponentCollector({ // create collector for buttons
      time: 60000,
    });
    let currentIndex = 0;
    collector.on("collect", async (button) => {
      if (button.message.id !== message.id || button.user.id !== requester ) return await button.deferUpdate();
      if (button.customId === "id_1") { // if left button is pressed
        currentIndex -= 15;
        if (currentIndex === 0) { // if we are on page 1 then disable prevoius button
          buttons.components[0].setDisabled(true);
        }
        buttons.components[1].setDisabled(false);
        if (row.length > 1) {
          menu = createMenu(plist, currentIndex)
          row.pop()
          row.push(menu)
        }
        await message.edit({
          embeds: [createPlaylistEmbed(plist, currentIndex)],
          components: row,
        });
        await button.deferUpdate();
      } else if (button.customId === "id_2") { // if right button is pressed
        currentIndex += 15;
        if (currentIndex + 15 > tracks.length) { //if we are on last page then disable next button
          buttons.components[1].setDisabled(true);
        }
        buttons.components[0].setDisabled(false);
        if (row.length > 1) {
          menu = createMenu(plist, currentIndex)
          row.pop()
          row.push(menu)
        }
        await message.edit({
          embeds: [createPlaylistEmbed(plist, currentIndex)],
          components: row,
        });
        await button.deferUpdate();
      } else if (button.customId === "id_3") { // if edit button is pressed
        menu = createMenu(plist, currentIndex)
        if (row.length === 1) {
          row.push(menu)
        } else {
          row.pop()
        }
        await message.edit({
          embeds: [createPlaylistEmbed(plist, currentIndex)],
          components: row,
        });
        await button.deferUpdate();
      } else if (button.customId === "select") {
        //for each value in button.values
        let toDelete = []
        for (const value of button.values) {
          toDelete.push(parseInt(value))
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        await deleteTracks(plist, toDelete)

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (row.length > 1) {
          menu = createMenu(plist, currentIndex)
          row.pop()
          row.push(menu)
        }
        await message.edit({
          embeds: [createPlaylistEmbed(plist, currentIndex)],
          components: row,
        });
        await button.deferUpdate();
      }
    });
    collector.on("end", async (button) => { // after 60 seconds remove buttons and set page to 1
      await message.edit({
        embeds: [createPlaylistEmbed(plist, 0)],
        components: [],
      });
    });
  });
}

async function deleteTracks(plist, toDelete) {
  //toDelete is an array of indexes to delete
  let tracks = plist.tracks
  let newTracks = []
  for (let i = 0; i < tracks.length; i++) {
    if (!toDelete.includes(i)) {
      newTracks.push(tracks[i])
    }
  }
  plist.tracks = newTracks
  plist.save()
}

function createMenu(plist, index){
  //add 15 tracks to array according to index
  let array = [];
  for (let i = index; i < index + 15; i++) {
    if (i >= plist.tracks.length) break;
    array.push({
      label: `${plist.tracks[i].title.substring(0, 25)}`,
      value: `${i}`,
      emoji: "❌",
    })
  }

  let menu = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId('select')
        .setPlaceholder('Select tracks to remove!')
				.setMinValues(1)
				.setMaxValues(array.length)
        .addOptions(array),
    );
  return menu;
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

async function rename(client, message, args, player, plist) {
  if (args[2] == "create" || args[2] == "list") return message.channel.send(client.error("Invalid playlist name!"));
  let failed = false
  await playlist.findOne({ id: message.author.id, name: args[2] }, (err, check) => {
    if (err) console.log(err);
    if (check) {
      failed = true;
    }
  }).clone()
  if (failed) return message.channel.send(client.error(`You already have playlist called ${args[2]}!`));
  let original = plist.name;
  plist.name = args[2];
  plist.save();
  return message.channel.send({
    embeds: [
      new MessageEmbed()
        .setTitle(`Playlist \`${original}\` was renamed to \`${plist.name}\`!`)
        .setColor(client.ee.color),
    ],
  });
}