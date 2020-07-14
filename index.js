const Discord = require('discord.js');
const {
    prefix,
    token,
    access_token,
} = require('./config.json');
const ytdl = require('ytdl-core');
const https = require('https');
const ytsr = require('ytsr');
const ffmpeg = require('ffmpeg');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(client.user.username + ' online');
    client.user.setPresence({ status: 'online', game: { name: 'с твоей мамашей', type: 0 } });
});

//function emoji (id) {
//   return client.emojis.get(id).toString();
//}

client.on('message', async message => {

    if (message.author.bot) return;

    if (message.content == "rainbow" && message.author.id == '249514842703003648') {
        message.delete();
        message.channel.send('<a:Rainbow:552553091686334498>');
        return;
    }

    if (!message.content.startsWith(prefix)) return;

    if (message.content.startsWith(prefix + "join")) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
        } else {
            message.reply('You need to join a voice channel first!');
        }
        return
    }
    else if (message.content.startsWith(prefix + "play")) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.reply("You need to be in a voice channel to play music!");
        const arg = message.content.substr(6,).trim();
        if (arg.startsWith("https://youtu.be/")) {
            arg.replace("https://youtu.be/", "https://www.youtube.com/watch?v");
            const connection = await voiceChannel.join();
            const songInfo = await ytdl.getInfo(arg);
            connection.play(ytdl(arg));
            return message.channel.send("Play: " + songInfo.title);
        }
        else if (arg.startsWith("https://www.youtube.com/watch?v")) {
            const connection = await voiceChannel.join();
            const songInfo = await ytdl.getInfo(arg);
            connection.play(ytdl(arg));
            return message.channel.send("Play: " + songInfo.title);
        }
        else {
            message.reply("Invalid YouTube URL");
            return
        }
    }
    else if (message.content.startsWith(prefix + "vk")) {
        if (message.member.voice.channel) {
            let arg = message.content.substr(4,).trim();
            if (arg.startsWith("https://vk.com/")) {
                arg = arg.substr(15,);
                const options = new URL('https://api.vk.com/method/users.get?user_ids=' + arg + '&fields=status&access_token=' + access_token + '&v=5.120');
                vkhttpsreq(options, message, vkmusicsearch);
                return;
            }
            else {
                message.reply("Invalid VK URL");
                return
            }
        }
        else {
            message.reply('You need to join a voice channel first!');
            return;
        }
    }
    else if (message.content.startsWith(prefix + "stop")) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            connection.dispatcher.end();
            return;
        } else {
            return message.reply('You need to join a voice channel first!');
        }
    }
    else if (message.content.startsWith(prefix + "leave")) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.leave();
            return;
        } else {
            return message.reply('You need to join a voice channel first!');
        }
    }
    else if (message.content.startsWith(prefix + "info")) {
        return;
    }
    else if (message.content.startsWith(prefix + "say")) {
        message.delete();
        return message.channel.send(message.content.substr(5,));
    }
    else if (message.content.startsWith(prefix + "gif")) {
        number = 4;
        gifNumber = Math.floor(Math.random() * (number - 1 + 1)) + 1;
        return message.channel.send({ files: ["./gif/" + gifNumber + ".gif"] });
    }
});

async function vkplay(message, result) {
    const connection = await message.member.voice.channel.join();
    const songInfo = await ytdl.getInfo(result);
    connection.play(ytdl(result));
    message.channel.send("Play: " + songInfo.title);
}

function vkhttpsreq(options, message, cb, nowplaymusic = undefined) {
    const req = https.request(options, (res) => {
        let obj = "";
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            //console.log(chunk);
            obj += chunk;
        });
        res.on('end', () => {
            //console.log('No more data in response.');
            var o = JSON.parse(obj);
            if (o.error != undefined) {
                console.log(o.error);
            }
            else if (o["response"][0].status_audio != undefined) {
                let music = o["response"][0].status_audio.artist + " - " + o["response"][0].status_audio.title
                if (nowplaymusic == undefined) {
                    cb(message, music)
                    vkhttpsreq(options, message, cb, music)
                }
                else if (music == nowplaymusic) {
                    vkhttpsreq(options, message, cb, music)
                }
                else {
                    cb(message, music)
                    vkhttpsreq(options, message, cb, music)
                }
            }
            else {
                message.channel.send("No music in status");
            }
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.end();
}

function vkmusicsearch(message, music) {
    let filter;
    console.log(music);
    ytsr.getFilters(music, function (err, filters) {
        if (err) {
            console.log("htp1");
            try {
                throw err;
            }
            catch (err) {
                console.log(err)
                vkmusicsearch(message, music);
            }
        }
        else {
            filter = filters.get('Type').find(o => o.name === 'Video');
            ytsr.getFilters(filter.ref, function (err, filters) {
                if (err) {
                    console.log("htp2");
                    try {
                        throw err;
                    }
                    catch (err) {
                        console.log(err)
                        vkmusicsearch(message, music);
                    }
                }
                else {
                    var options = {
                        limit: 1,
                        nextpageRef: filter.ref,
                    }
                    ytsr(null, options, function (err, searchResults) {
                        if (err) {
                            console.log("htp3");
                            try {
                                throw err;
                            }
                            catch (err) {
                                console.log(err)
                                vkmusicsearch(message, music);
                            }
                        }
                        else {
                            console.log("результат мазафака");
                            console.log(searchResults.items[0].link);
                            vkplay(message, searchResults.items[0].link);
                        }
                    });
                }
            });
        }
    });
}


client.login(token);