const Discord = require('discord.js');
const {
    prefix,
    token,
    access_token,
} = require('./config.json');
const ytdl = require('ytdl-core');
var https = require('https');
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
        if (message.member.voice.channel) {
            /*
            const connection = await message.member.voice.channel.join();
            const ytdl = require('ytdl-core');
            connection.play(ytdl(message.content.substr(6,), { filter: 'audioonly' }));

            const broadcast = client.voice.createBroadcast();
            broadcast.play('/home/hydrabolt/audio.mp3');
            connection.play(broadcast);
            */
            const connection = await message.member.voice.channel.join();
            const broadcast = client.voice.createBroadcast();
            broadcast.play(ytdl(message.content.substr(6,), { filter: 'audioonly' }));
            connection.play(broadcast);
        } else {
            message.reply('You need to join a voice channel first!');
        }
        return
    }
    else if (message.content.startsWith(prefix + "vk")) {

        const options = new URL('https://api.vk.com/method/users.get?user_ids=aff3ct&fields=status&access_token=' + access_token + '&v=5.120');

        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                //console.log(chunk);
                let obj = JSON.parse(chunk);
                if (obj.error != undefined) {
                    console.log(obj.error);
                    return;
                }
                console.log(obj["response"][0].status_audio);
                if (obj["response"][0].status_audio != undefined) {
                    const ytsr = require('ytsr');
                    let filter;
                    let music = obj["response"][0].status_audio.artist + " - " + obj["response"][0].status_audio.title
                    message.channel.send(music);
                    ytsr.getFilters(music, function (err, filters) {
                        if (err) {
                            console.log("htp1");
                            throw err;
                        }
                        filter = filters.get('Type').find(o => o.name === 'Video');
                        ytsr.getFilters(filter.ref, function (err, filters) {
                            if (err) {
                                console.log("htp2");
                                throw err;
                            }
                            var options = {
                                limit: 1,
                                nextpageRef: filter.ref,
                            }
                            ytsr(null, options, function (err, searchResults) {
                                if (err) {
                                    console.log("htp3");
                                    throw err;
                                }
                                //const connection = await message.member.voice.channel.join();
                                //const broadcast = client.voice.createBroadcast();
                                //broadcast.play(ytdl(searchResults.items[0].link, { filter: 'audioonly' }));
                                //connection.play(broadcast);
                                console.log("результат мазафака");
                                console.log(searchResults.items[0].link);
                                vkplay(message, searchResults.items[0].link);
                            });
                        });
                    });
                }
                else {
                    message.channel.send("Добавьте музыку в статус");
                }
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });

        req.end();

        return;
    }

    else if (message.content.startsWith(prefix + "skip")) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const broadcast = client.voice.createBroadcast();
            broadcast.end()
            connection.play(broadcast);
        } else {
            message.reply('You need to join a voice channel first!');
        }
        return;
    }
    else if (message.content.startsWith(prefix + "leave")) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.leave();
        } else {
            message.reply('You need to join a voice channel first!');
        }
        return;
    }
    else if (message.content.startsWith(prefix + "info")) {
        return;
    }
    else if (message.content.startsWith(prefix + "say")) {
        message.delete();
        message.channel.send(message.content.substr(5,));
        return;
    }
    else if (message.content.startsWith(prefix + "gif")) {
        number = 4;
        gifNumber = Math.floor(Math.random() * (number - 1 + 1)) + 1;
        message.channel.send({ files: ["./gif/" + gifNumber + ".gif"] })
        return;
    }
});

async function vkplay(message, result) {
    const connection = await message.member.voice.channel.join();
    const broadcast = client.voice.createBroadcast();
    broadcast.play(ytdl(result, { filter: 'audioonly' }));
    connection.play(broadcast);
    return;
}

client.login(token);