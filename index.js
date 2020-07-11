const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require(`./config.json`);

//function emoji (id) {
//   return client.emojis.get(id).toString();
//}

bot.on('message', async message => {
    let prefix = config.prefix;

    if (!message.guild) return;

    if (message.content == (prefix + "join")) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    if (message.content.startsWith(prefix + "play")) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const ytdl = require('ytdl-core');
            connection.play(ytdl(message.content.substr(6,), { filter: 'audioonly' }));
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    if (message.content == (prefix + "leave")) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.leave();
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    if (message.content.startsWith(prefix + "say")) {
        message.delete();
        message.channel.send(message.content.substr(5,));
        return;
    }

    if (message.content == (prefix + "gif")) {
        number = 4;
        gifNumber = Math.floor(Math.random() * (number - 1 + 1)) + 1;
        message.channel.send({ files: ["./gif/" + gifNumber + ".gif"] })
        return;
    }

    if (message.content == "rainbow" && message.author.id == '249514842703003648') {
        message.delete();
        message.channel.send('<a:Rainbow:552553091686334498>');
        return;
    }
});

bot.login(config.token);
bot.on('ready', () => {
    console.log(bot.user.username + ' online');
    bot.user.setPresence({ status: 'online', game: { name: 'с твоей мамашей', type: 0 } });
});