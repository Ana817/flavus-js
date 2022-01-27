const { MessageEmbed } = require("discord.js");

module.exports = async function(client, player) {
    if (player.get(`previousTrack`).requester != client.user || !player.get(`similarQueue`) || player.get(`similarQueue`).length === 0) {
      try {
        const previoustrack = player.get(`previousTrack`)
        if (!previoustrack) return
        const mixURL = `https://www.youtube.com/watch?v=${previoustrack.identifier}&list=RD${previoustrack.identifier}`;
        const response = await client.manager.search(mixURL, client.user);
        //if nothing is found, send error message
        if (!response || response.loadType === 'LOAD_FAILED' || response.loadType !== 'PLAYLIST_LOADED') {
          return client.channels.cache.get(player.textChannel).send(client.error(`No similar tracks found!`)).catch(() => { });
        }
        //remove every track from response.tracks that has the same identifier as the previous track
        response.tracks = response.tracks.filter(track => track.identifier !== previoustrack.identifier);
        //if there are no tracks left in the response, send error message
        if (!response.tracks.length) {
          return client.channels.cache.get(player.textChannel).send(client.error(`No similar tracks found!`)).catch(() => { });
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
      const embed = new MessageEmbed()
        .setTitle("Autoplay")
        .setDescription(`[${track.title}](${track.uri})`)
        .setColor(client.embed.color)
        .setThumbnail(track.thumbnail);
      client.channels.cache.get(player.textChannel).send({ embeds: [embed] }).catch(() => { });
      return player.play();
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
    }
    return
}
