const { MessageEmbed } = require("discord.js")

module.exports = async (client, message, args, type) => {
  let method = type.includes(":") ? type.split(":") : Array(type)
  if (!message.guild) return;
  let {
    channel
  } = message.member.voice;
  const permissions = channel.permissionsFor(client.user);

  if (!permissions.has("CONNECT")) {
    return message.reply({
      embeds: [new MessageEmbed()
        .setColor(client.embed.wrongcolor)
        .setTitle('I dont have the permission to connect to a voice channel!')
      ]
    }).catch((e) => console.log(String(e).grey));
  }

  if (!permissions.has("SPEAK")) {
    return message.reply({
      embeds: [new MessageEmbed()
        .setColor(client.embed.wrongcolor)
        .setTitle('I dont have the permission to speak in this voice channel!')
      ]
    }).catch((e) => console.log(String(e).grey));
  }

  if (method[0] === "song") {
    require("./playermanagers/song")(client, message, args, type);
  } else if (method[0] === "similar") {
    require("./playermanagers/similar")(client, message, args, type);
  } else if (method[0] === "search") {
    require("./playermanagers/search")(client, message, args, type);
  } else if (method[0] === "playtop") {
    require("./playermanagers/playtop")(client, message, args, type)
  } else {
    return client.logger('playermanager error!'.error)
    }
}
//Original code by Tomato#6966 | https://discord.gg/milrato
