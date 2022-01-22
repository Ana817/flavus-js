const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const { MessageActionRow, MessageButton } = require("discord.js");
var { splitLyrics } = require(`${process.cwd()}/src/utils/functions`);

module.exports = {
  name: "lyrics",
  aliases: ["ly"],
  description: "Tries to look up the lyrics of a specific or currently playing track",
  usage: `\`<prefix>lyrics\` or \`<prefix>ly <query>\``,
  visible: true,
  voice: true,
  player: true,
  async execute(client, message, args, player) {
    let lyrics;
    let lyricsmessage;
    let lyricsarray
    let name;
    let lifetime = 120000;

    let row = new MessageActionRow().addComponents(
      (but_1 = new MessageButton().setCustomId("id_1").setEmoji("⬅️").setStyle("SECONDARY").setDisabled(true)),
      (but_2 = new MessageButton().setCustomId("id_2").setEmoji("➡️").setStyle("SECONDARY"))
    );  

    if (args[0]) { //if there is an argument then use it as a query
      lyricsmessage = await message.channel.send({ //send a searching message to the channel
        embeds: [new MessageEmbed().setTitle("Searching...").setColor(client.ee.color)],
      });
      let query = args.join(" ");
      lyrics = await queryLyrics(query, client);//get the lyrics
      if (lyrics == "Not Found!") { //if not found then send a message
        return lyricsmessage.edit({
          embeds: [
            new MessageEmbed()
              .setColor(client.ee.wrongcolor)
              .setTitle("Could not find lyrics for this song!"),
          ],
        });
      } else {
        name = query
        lyricsarray = await splitLyrics(lyrics)
      }
    } else { //if no argument then use the current song
      if (!player || !player.queue.current) { //if no player then send a message
        return lyricsmessage.edit({
          embeds: [
            new MessageEmbed()
              .setColor(client.ee.wrongcolor)
              .setTitle("I am not playing anything right now!"),
          ],
        });
      }
      lyricsmessage = await message.channel.send({ //send a searching message to the channel
        embeds: [new MessageEmbed().setTitle("Searching...").setColor(client.ee.color)],
      });
      lyrics = await getLyrics(player.queue.current.author, player.queue.current.title, client);
      if (lyrics == "Not Found!") { //if not found then send a message
        return lyricsmessage.edit({
          embeds: [
            new MessageEmbed()
              .setColor(client.ee.wrongcolor)
              .setTitle("Could not find lyrics for this song!"),
          ],
        });
      } else { //if found then send the lyrics
        let current = player.queue.current.duration !== 0 ? player.position : player.queue.current.duration;
        let total = player.queue.current.duration;
        lifetime = total - current;
        name = player.queue.current.title
        lyricsarray = await splitLyrics(lyrics)
      }
    }
    
    lyricsmessage.edit({
      embeds: [
        createEmbed(lyricsarray, name, 0, client),
      ],
    }).then(async message => {
      if (lyricsarray.length === 1) return
      message.edit({
        components: [row],
      });
      
      const collector = message.channel.createMessageComponentCollector({ // create collector for buttons
        time: lifetime,
      });
      //do not react if button is from another message
      
      let currentIndex = 0;
      collector.on("collect", async (button) => {
        if (button.message.id !== message.id) return
        if (button.customId === "id_1") { // if left button is pressed
          currentIndex -= 1;
          if (currentIndex === 0) { // if we are on page 1 then disable prevoius button
            row.components[0].setDisabled(true);
          }
          row.components[1].setDisabled(false);
          await message.edit({
            embeds: [createEmbed(lyricsarray, name, currentIndex, client)],
            components: [row],
          });
          await button.deferUpdate(); //deferupdate
        } else if (button.customId === "id_2") { // if right button is pressed
          currentIndex += 1;
          if (currentIndex + 2 > lyricsarray.length) { //if we are on last page then disable next button
            row.components[1].setDisabled(true);
          }
          row.components[0].setDisabled(false);
          await message.edit({
            embeds: [createEmbed(lyricsarray, name, currentIndex, client)],
            components: [row],
          });
          await button.deferUpdate(); //deferupdate
        }
      });
      collector.on("end", async (button) => { // after 60 seconds remove buttons and set page to 1
        await message.edit({
          embeds: [createEmbed(lyricsarray, name, 0, client)],
          components: [],
        });
      });
    })
    
    return

  },
};

function createEmbed(lyricsarray, name, index, client) {
  if (lyricsarray[index].length >= 3900) {
    return new MessageEmbed()
          .setColor(client.ee.wrongcolor)
          .setTitle("There was an error while sending the lyrics!")
          .setDescription(`Reason: \`${lyricsarray[index].length}\``)
  }
  return new MessageEmbed()
    .setTitle(name)
    .setColor(client.ee.color)
    .setDescription(`\`\`\`${lyricsarray[index]}\`\`\``)
    .setFooter(`Page ${index + 1} of ${lyricsarray.length}`);
}

async function getLyrics(artist, title, client) {
  const query = `${artist} ${title}`;
  try { //first try to get the lyrics from genius
    const searches = await client.lyrics.songs.search(query);
    //if !searches then error
    if (searches.length !== 0) {
      const lyrics = await searches[0].lyrics();
      return lyrics;
    } else {
      throw new Error("Not Found!");
    }
  } catch (err) { //if not found
    try { //if not found then try use just title as a query
      const searches = await client.lyrics.songs.search(title);
      if (searches.length === 0) {
        return "Not Found!";
      }
      const lyrics = await searches[0].lyrics();
      return lyrics;
    } catch (err) { //if not found then try use lyricsFinder to scrape the lyrics from google
      let lyrics;
      lyrics = (await lyricsFinder(artist, title)) || "Not Found!"; //query using artist and title
      if (lyrics == "Not Found!") { //if not found then query using title only
        lyrics = (await lyricsFinder("", title)) || "Not Found!";
      }
      return lyrics;
    }
  }
}

async function queryLyrics(query, client) {
  try { //first try to get the lyrics from genius
    const searches = await client.lyrics.songs.search(query);
    //if !searches then error
    if (searches.length === 0) {
      return "Not Found!";
    }
    const lyrics = await searches[0].lyrics();
    return lyrics;
  } catch (err) { //if not found try use lyricsFinder to scrape the lyrics from google
    let lyrics;
    lyrics = (await lyricsFinder("", query)) || "Not Found!";
    return lyrics;
  }
}
