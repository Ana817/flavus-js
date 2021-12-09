# Lavaxe

My personal music bot powered by lavalink. Based on [discord.js](https://discord.js.org/#/) and [erela.js](https://erelajs-docs.netlify.app/docs/gettingstarted.html#documentation-guides).

### Features
- can play music from **YouTube**, **Spotify**, **SoundCloud**, **Twitch**, and more
- has command to launch discord watchtogether activity
- stores volume settings in MongoDB database


### Lavalink server and MongoDB instance required
 If you dont want to host your own Lavalink use these settings in `./config/config.json`:
 ```json
"clientsettings": {
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
```

You can then modify the settings in the configuration file located in `config` folder `config.js`.

```json
{
    "prefix": "XXX",
    
    "status": {
       "text": "XXX",
       "type": "PLAYING",
       "url": "XXX"
    },
    "clientsettings": {
       "nodes": [
          {
            "host": "localhost",
            "port": 2333,
            "password": "youshallnotpass"
          }
       ]
    },
 
    "spotify": {
       "clientID": "XXX",
       "clientSecret": "XXX"
    }
}
```
# Credits
Currently most of code in this project is coming from **[discord-js-lavalink-Music-Bot-erela-js](https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js)** coded by **[Tomato#6966](https://github.com/Tomato6966)**.

##TODO:
- [ ] Add more commands
- [ ] Add option to create and save playlists
- [ ] Disconnect from voice channel when its empty
- [ ] Rework all embeds
- [ ] Unify config files
- [ ] Clean up code

