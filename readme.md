# Lavaxe

My personal music bot powered by lavalink. Based on [discord.js](https://discord.js.org/#/) and [erela.js](https://erelajs-docs.netlify.app/docs/gettingstarted.html#documentation-guides).

### Features
- can play music from **YouTube**, **Spotify**, **Twitch**, and more
- has command to launch discord watchtogether activity
- stores settings in MongoDB database


### Lavalink server and MongoDB instance required
 If you dont want to host your own Lavalink use these settings in `./config/config.json`:
 ```json
"lavalink": {
    "nodes": [
        {
        "host": "lavalink.eu",
        "port": 2333,
        "password": "Raccoon"
        }
    ]
}
 ```

## Configuration

Create `.env` file or set your env variables as follows:
```env
token = <YOUR_DISCORD_BOT_TOKEN>
owner = <OWNER_DISCORD_ID>
MONGODB_SRV = <MONGODB_SRV>
clientID = <SPOTIFY_CLIENT_ID>
clientSecret = <SPOTIFY_CLIENT_SECRET>
prefix = <PREFIX> (optional)
lavasecret = <LAVALINK_PASSWORD> (optional - you can define it in config.json)
```

You can then modify the settings in the configuration file located in `config` folder `config.js`.

```json
{
  "prefix": "*",
  "status": {
    "text": "crashing",
    "type": "PLAYING",
    "url": "https://twitch.tv/#"
  },
  "lavalink": {
    "nodes": [
        {
          "host": "localhost",
          "port": 80,
          "password": "youshallnotpass",
          "secure": false
        }
    ]
  },
  "visuals": {
    "embed": {
      "color": "#ffcc00",
      "wrongcolor": "#FF0000",
      "footertext": "LAVAXE",
      "footericon": "XXX",
      "progress_bar": {
        "size": "12",
        "block": "▬",
        "empty": "▬",
        "arrow": ":blue_circle:"
      }
    }
  }
}
```
# Credits
Lot of code in this project is coming from **[discord-js-lavalink-Music-Bot-erela-js](https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js)** coded by **[Tomato#6966](https://github.com/Tomato6966)**.

## TODO
- [ ] Add more commands
- [ ] Add option to create and save playlists
- [ ] Disconnect from voice channel when its empty
- [ ] Rework all embeds
- [ ] Clean up code

