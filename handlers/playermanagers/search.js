var {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu
} = require("discord.js")
var { format } = require(`${process.cwd()}/utils/functions`)

//function for searching songs
async function search(client, message, args, type) {
  var search = args.join(" ");
  try {
    var res;
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
      res = await client.manager.search({
        query: search,
        source: type.split(":")[1]
      }, message.author);
      // Check the load type as this command is not that advanced for basics
      if (res.loadType === "LOAD_FAILED") throw res.exception;
      else if (res.loadType === "PLAYLIST_LOADED") throw {
        message: "Playlists are not supported with this command. Use   ?playlist  "
      };
    } catch (e) {
      console.log(e.stack ? String(e.stack).grey : String(e).grey)
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(client.ee.wrongcolor)
          .setTitle(eval(client.la[ls]["handlers"]["playermanagers"]["search"]["variable1"]))
          .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["search"]["variable2"]))
        ]
      }).catch(() => {})
    }


    var max = 10;
    var collected;
    var cmduser = message.author;
    if (res.tracks.length < max) max = res.tracks.length;
    var track = res.tracks[0]
    var theresults = res.tracks
      .slice(0, max)
    var results = theresults.map((track, index) => `**${++index})** [\`${String(track.title).substr(0, 60).split("[").join("{").split("]").join("}")}\`](${track.uri}) - \`${format(track.duration).split(" | ")[0]}\``)
      .join('\n');


    const emojiarray = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]
    first_layer()
    async function first_layer() {
      //define the selection
      var songoptions = [...emojiarray.slice(0, max).map((emoji, index) => {
          return {
            value: `Add ${index + 1}. Track`.substr(0, 25),
            label: `Add ${index + 1}. Track`.substr(0, 25),
            description: `Add: ${res.tracks[index].title}`.substr(0, 50),
            emoji: `${emoji}`
          }
        }),
        {
          value: `Cancel`,
          label: `Cancel`,
          description: `Cancel the Searching Process`,
          emoji: "❌"
        }
      ];
      let Selection = new MessageSelectMenu()
        .setCustomId('MenuSelection').setMaxValues(emojiarray.slice(0, max).length)
        .setPlaceholder('Select all Songs you want to add')
        .addOptions(songoptions)
      //send the menu msg
      let menumsg;
      menumsg = await message.channel.send({
        embeds: [
          new MessageEmbed()
          .setTitle(`Results for: **\`${search}`.substr(0, 256 - 3) + "`**")
          .setColor(client.ee.color)
          .setDescription(results)
        ],
        components: [
          new MessageActionRow().addComponents(Selection)
        ]
      }).catch(() => {});
      //Create the collector
      const collector = menumsg.createMessageComponentCollector({
        filter: i => i.isSelectMenu() && i.message.author.id == client.user.id && i.user,
        time: 90000
      })
      //Menu Collections
      collector.on('collect', async menu => {
        if (menu.user.id === cmduser.id) {
          collector.stop();
          menu.deferUpdate();
          if (menu.values[0] == "Cancel") {
            return message.react('❌').catch((e) => {})
          }
          var picked_songs = [];
          let toAddTracks = [];
          for (const value of menu.values) {
            let songIndex = songoptions.findIndex(d => d.value == value);
            var track = res.tracks[songIndex]
            toAddTracks.push(track)
            picked_songs.push(`**${songIndex + 1})** [\`${String(track.title).substr(0, 60).split("[").join("\\[").split("]").join("\\]")}\`](${track.uri}) - \`${format(track.duration).split(" | ")[0]}\``)
          }
          menumsg.edit({
            embeds: [menumsg.embeds[0].setTitle(`Picked Songs:`).setDescription(picked_songs.join("\n\n"))],
            components: [],
            content: `${collected && collected.first() && collected.first().values ? `**Selected: \`${collected ? collected.map(s => s.value).join(", ") : "Nothing"}\`**` : "**NOTHING SELECTED - CANCELLED**" }`
          })
          if (player.state !== "CONNECTED") {
            //set the variables
            player.set("message", message);
            player.set("playerauthor", message.author.id);
            player.connect();
            //add track
            player.queue.add(toAddTracks);
            //set the variables
            //play track
            player.play();
            player.pause(false);

          } else if (!player.queue || !player.queue.current) {
            //add track
            player.queue.add(toAddTracks);
            //play track
            player.play();
            player.pause(false);
          } else {
            player.queue.add(toAddTracks);
            var track = toAddTracks[0]
            var embed3 = new MessageEmbed()
              .setTitle(`Added ${toAddTracks.length > 1 ? `${toAddTracks.length} Tracks, with the first one beeing: `: ``}${track.title}`)
              .setDescription(`**Queued [${track.title}](${track.uri})**`)
              .setColor(client.ee.color)
              .addField("Duration: ", `\`${track.isStream ? "LIVE STREAM" : format(track.duration)}\``, true)
              .addField("Song By: ", `\`${track.author}\``, true)
            
            await message.channel.send({
              embeds: [embed3]
            }).catch(() => {});
          }

        } else menu.reply({
          content: `You are not allowed to do that! Only: <@${cmduser.id}>`,
          ephemeral: true
        });
      });
      //Once the Collections ended edit the menu message
      collector.on('end', collected => {});
    }


  } catch (e) {
    console.log(e.stack ? String(e.stack).grey : String(e).grey)
    return message.channel.send({
      embeds: [new MessageEmbed()
        .setColor(client.ee.wrongcolor)
        .setTitle(String("Nothing found for: **`" + search).substr(0, 256 - 3) + "`**")
      ]
    }).catch(() => {}).then(msg => {
      setTimeout(() => msg.delete().catch(() => {}), 3000)
    })
  }
}

module.exports = search;
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
