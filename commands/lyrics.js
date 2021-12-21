const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

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

    if (args[0]) { //if there is an argument then use it as a query
      lyricsmessage = await message.channel.send({ //send a searching message to the channel
        embeds: [new MessageEmbed().setTitle("Searching...").setColor(client.ee.color)],
      });
      let query = args.join(" ");
      lyrics = await queryLyrics(query, client);//get the lyrics
      if (lyrics == "Not Found!") { //if not found then send a message
        lyricsmessage.edit({
          embeds: [
            new MessageEmbed()
              .setColor(client.ee.wrongcolor)
              .setTitle("Could not find lyrics for this song!"),
          ],
        });
      } else { //if found then send the lyrics
        lyricsmessage.edit({
          embeds: [
            new MessageEmbed()
              .setColor(client.ee.color)
              .setTitle(`**${query}**`)
              .setDescription(`\`\`\`${lyrics}\`\`\``),
          ],
        });
      }
    } else { //if no argument then use the current song
      if (!player) { //if no player then send a message
        return message.channel.send({
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
        lyricsmessage.edit({
          embeds: [
            new MessageEmbed()
              .setColor(client.ee.wrongcolor)
              .setTitle("Could not find lyrics for this song!"),
          ],
        });
      } else { //if found then send the lyrics
        lyricsmessage.edit({
          embeds: [
            new MessageEmbed()
              .setColor(client.ee.color)
              .setTitle(`**${player.queue.current.title}**`)
              .setURL(player.queue.current.uri)
              .setDescription(`\`\`\`${lyrics}\`\`\``),
          ],
        });
      }
    }
    return;
  },
};

async function getLyrics(artist, title, client) {
  const query = `${artist} ${title}`;
  try { //first try to get the lyrics from genius
    const searches = await client.lyrics.songs.search(query);
    //if !searches then error
    if (searches.length === 0) {
      return "Not Found!";
    }
    const lyrics = await searches[0].lyrics();
    return lyrics;
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
