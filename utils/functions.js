const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/config/config.json`);
const ee = config.visuals.embed;
const toTime = require("to-time");

module.exports.handlemsg = handlemsg;
module.exports.nFormatter = nFormatter;
module.exports.shuffle = shuffle;
module.exports.delay = delay;
module.exports.duration = duration;
module.exports.createBar = createBar;
module.exports.format = format;
module.exports.escapeRegex = escapeRegex;
module.exports.arrayMove = arrayMove;
module.exports.isValidURL = isValidURL;
module.exports.createQueueEmbed = createQueueEmbed;
module.exports.splitLyrics = splitLyrics;
module.exports.autoplay = autoplay;

function handlemsg(txt, options) {
  let text = String(txt);
  for (const option in options) {
    var toreplace = new RegExp(`{${option.toLowerCase()}}`, "ig");
    text = text.replace(toreplace, options[option]);
  }
  return text;
}

function isValidURL(string) {
  const args = string.split(" ");
  let url;
  for (const arg of args) {
    try {
      url = new URL(arg);
      url = url.protocol === "http:" || url.protocol === "https:";
      break;
    } catch (_) {
      url = false;
    }
  }
  return url;
}

function shuffle(a) {
  try {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  } catch (e) {
    console.log(String(e.stack).grey.bgRed);
  }
}

function duration(duration, useMilli = false) {
  let remain = duration;
  let days = Math.floor(remain / (1000 * 60 * 60 * 24));
  remain = remain % (1000 * 60 * 60 * 24);
  let hours = Math.floor(remain / (1000 * 60 * 60));
  remain = remain % (1000 * 60 * 60);
  let minutes = Math.floor(remain / (1000 * 60));
  remain = remain % (1000 * 60);
  let seconds = Math.floor(remain / 1000);
  remain = remain % 1000;
  let milliseconds = remain;
  let time = {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
  let parts = [];
  if (time.days) {
    let ret = time.days + " Day";
    if (time.days !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (time.hours) {
    let ret = time.hours + " Hr";
    if (time.hours !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (time.minutes) {
    let ret = time.minutes + " Min";
    if (time.minutes !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (time.seconds) {
    let ret = time.seconds + " Sec";
    if (time.seconds !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (useMilli && time.milliseconds) {
    let ret = time.milliseconds + " ms";
    parts.push(ret);
  }
  if (parts.length === 0) {
    return ["instantly"];
  } else {
    return parts;
  }
}

function delay(delayInms) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  } catch (e) {
    console.log(String(e.stack).grey.bgRed);
  }
}

function createBar(player) {
  let { size, arrow, block } = ee.progress_bar;
  //player.queue.current.duration == 0 ? player.position : player.queue.current.duration, player.position, 25, "▬", "🔷")
  if (!player.queue.current) return `**[${slider}${line.repeat(size - 1)}${rightindicator}**\n**00:00:00 / 00:00:00**`;
  let current = player.queue.current.duration !== 0 ? player.position : player.queue.current.duration;
  let total = player.queue.current.duration;
  const progress = Math.round((size * current) / total);
  const emptyProgress = size - progress;
  const progressString = block.repeat(progress) + arrow + block.repeat(emptyProgress);
  const bar = progressString;
  const times = `${
    new Date(player.position).toISOString().substr(11, 8) +
    " / " +
    (player.queue.current.duration == 0 ? " ◉ LIVE" : new Date(player.queue.current.duration).toISOString().substr(11, 8))
  }`;
  return `[${bar}][${times}]`;
}

function format(millis) {
  try {
    var h = Math.floor(millis / 3600000),
      m = Math.floor(millis / 60000),
      s = ((millis % 60000) / 1000).toFixed(0);
    if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + Math.floor(millis / 1000) + " Seconds";
    else return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + Math.floor(millis / 1000) + " Seconds";
  } catch (e) {
    console.log(String(e.stack).grey.bgRed);
  }
}

function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(String(e.stack).grey.bgRed);
  }
}

function arrayMove(array, from, to) {
  try {
    array = [...array];
    const startIndex = from < 0 ? array.length + from : from;
    if (startIndex >= 0 && startIndex < array.length) {
      const endIndex = to < 0 ? array.length + to : to;
      const [item] = array.splice(from, 1);
      array.splice(endIndex, 0, item);
    }
    return array;
  } catch (e) {
    console.log(String(e.stack).grey.bgRed);
  }
}

function nFormatter(num, digits = 2) {
  const lookup = [
    {
      value: 1,
      symbol: "",
    },
    {
      value: 1e3,
      symbol: "k",
    },
    {
      value: 1e6,
      symbol: "M",
    },
    {
      value: 1e9,
      symbol: "G",
    },
    {
      value: 1e12,
      symbol: "T",
    },
    {
      value: 1e15,
      symbol: "P",
    },
    {
      value: 1e18,
      symbol: "E",
    },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

async function autoplay(client, player) {
  if (player.get(`previousTrack`).requester != client.user || !player.get(`similarQueue`) || player.get(`similarQueue`).length === 0) {
    try {
      const previoustrack = player.get(`previousTrack`)
      if (!previoustrack) return
      const mixURL = `https://www.youtube.com/watch?v=${previoustrack.identifier}&list=RD${previoustrack.identifier}`;
      const response = await client.manager.search(mixURL, client.user);
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
      response.tracks = response.tracks.filter(track => track.identifier !== previoustrack.identifier);
      //if there are no tracks left in the response, send error message
      if (!response.tracks.length) {
        const embed = new MessageEmbed()
          .setTitle("Error")
          .setDescription(`No similar tracks found!`)
          .setColor(0xFF0000);
        client.channels.cache.get(player.textChannel).send(embed).catch(() => { });
        return;
      }
      player.set(`similarQueue`, response.tracks); //set the similar queue
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
    }
  }
  try {
    const similarQueue = player.get(`similarQueue`);
    //pick and remove a random track from the similar queue
    const track = similarQueue.splice(Math.floor(Math.random() * similarQueue.length), 1)[0];
    player.set(`similarQueue`, similarQueue)
    player.queue.add(track);
    console.log(similarQueue)
    console.log(typeof similarQueue)
    const embed = new MessageEmbed()
      .setTitle("Autoplay")
      .setDescription(`[${track.title}](${track.uri})`)
      .setColor(ee.color)
      .setThumbnail(track.thumbnail);
    client.channels.cache.get(player.textChannel).send({ embeds: [embed] }).catch(() => { });
    return player.play();
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
  return
}

function createQueueEmbed(player, index) {
  const tracks = player.queue;
  let tDuration = { duration : 0, stream : 0 };
  //for each track in queue, if isStream = false, add its duration to total duration
  tracks.forEach(track => {
    if (!track.isStream) tDuration.duration += track.duration;
    else tDuration.stream++; 
  });
  //if current track is a stream, add 1 to stream, if not, add its duration to total duration
  if (player.queue.current.isStream) tDuration.stream++;
  else {
    let current = player.queue.current.duration !== 0 ? player.position : player.queue.current.duration;
    let total = player.queue.current.duration;
    tDuration.duration += total - current;
  }
  let queueLength
  if (tracks.length === 0) {
    queueLength = "";
  } else if (tracks.length === 1) {
    queueLength = "  -  1 Track";
  } else {
    queueLength = `  -  ${tracks.length} Tracks`
  }
  let totalDuration = "";
  if (tDuration.duration !== 0 || tDuration.stream !== 0) {
    if (tDuration.duration > 0) {
      const frame = toTime.fromMinutes(Math.floor(tDuration.duration / 60000));
      totalDuration += `\n\nTotal length - \`${frame.humanize()}\``
      if (tDuration.stream > 0) totalDuration += ` + \`${tDuration.stream}\` Streams`
    } else {
      totalDuration += `\n\nTotal length - \`${tDuration.stream}\` Streams`
    }
  }
  const embed = new MessageEmbed().setTitle("Queue" + queueLength).setColor(ee.color);
  let string = "";
  var indexes = [];
  var titles = [];
  var durations = [];
  tracks.map((track, index) => {
    //load indexes
    indexes.push(`${++index}`);
    //load titles
    let string = `${escapeRegex(track.title.substr(0, 60).replace(/\[/giu, "\\[").replace(/\]/giu, "\\]"))}`;
    if (string.length > 37) {
      string = `${string.substr(0, 37)}...`;
    }
    titles.push(string);
    //load durations
    durations.push(`${track.isStream ? `LIVE STREAM` : format(track.duration).split(` | `)[0]}`);
  });
  let npstring = `${escapeRegex(tracks.current.title.substr(0, 60).replace(/\[/giu, "\\[").replace(/\]/giu, "\\]"))}`;
  if (npstring.length > 37) {
    string = `**Now Playing - ` + `[${npstring.substr(0, 37)}...](${tracks.current.uri})` + `**\n${tracks.current.isStream ? `[:red_circle: LIVE STREAM]` : createBar(player)}\n`;
  } else {
    string = `**Now Playing - ` + `[${npstring}](${tracks.current.uri})` + `**\n${tracks.current.isStream ? `[:red_circle: LIVE STREAM]` : createBar(player)}\n`;
  }

  if (indexes.length <= 15) {
    string += `\n`;
    for (let i = 0; i < tracks.length; i++) {
      //check if any index in track is longer than 1 digit
      let line = `**${indexes[i]})** ${titles[i]} - [${durations[i]}]`;
      string += line + "\n";
    }
    string += "\n" + "This is the end of the queue!" + "\n" + "Use -play to add more :^)";
    embed.setDescription(string + totalDuration).setFooter("Page 1 of 1").setThumbnail(tracks.current.thumbnail);
  } else {
    indexes = indexes.slice(index, index + 15);
    titles = titles.slice(index, index + 15);
    durations = durations.slice(index, index + 15);
    string += `\n`;
    for (let i = 0; i < indexes.length; i++) {
      let line = `**${indexes[i]})** ${titles[i]} - [${durations[i]}]`;
      string += line + "\n";
    }
    if (Math.ceil((index + 15) / 15) == Math.ceil(tracks.length / 15)) string += "\n" + "This is the end of the queue!" + "\n" + "\n" + "Use -play to add more :^)";
    embed
      .setDescription(string + totalDuration)
      .setFooter("Page " + Math.ceil((index + 15) / 15) + " of " + Math.ceil(tracks.length / 15))
      //floor tracks.length / 15 up
      .setThumbnail(tracks.current.thumbnail);
  }
  return embed;
}



function splitLyrics(lyrics) {
  let lyricsArray = [];
  if (!lyrics.includes("\n\n")) { //if there is no empty lines
    let lines = lyrics.split("\n"); //split into lines
    for (let i = 0; i < lines.length; i += 35) { 
      lyricsArray.push(lines.slice(i, i + 35).join("\n")); //split into pages of 35 lines
    }
  } else {
    let paragraphs = lyrics.split("\n\n"); //split into paragraphs
    lyricsArray.push(paragraphs[0]); //push first paragraph
    for (let i = 1; i < paragraphs.length; i++) {
      if (paragraphs[i].split("\n").length + lyricsArray[lyricsArray.length - 1].split("\n").length < 35) { //check if combined with previous paragraph is less than 35 lines
        lyricsArray[lyricsArray.length - 1] += "\n\n" + paragraphs[i]; //combine paragraphs
      } else { //if more than 35 lines
        let lines = paragraphs[i].split("\n");
        for (let i = 0; i < lines.length; i += 35) {
          lyricsArray.push(lines.slice(i, i + 35).join("\n"));
        }
      }
    }
  }
  return lyricsArray; //return array of pages
}