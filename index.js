const Discord = require('discord.js');
const {
    prefix,
    token,
    access_token,
} = require('./config.json');
const ytdl = require('ytdl-core');
var https = require('https');

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
            const ytdl = require('ytdl-core');
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
                if (obj["response"][0].status != undefined)
                    message.channel.send(obj["response"][0].status);
                if (obj["response"][0].status_audio != undefined)
                    message.channel.send(obj["response"][0].status_audio.title);
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

client.login(token);