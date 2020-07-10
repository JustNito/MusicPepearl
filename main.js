const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require(`./config.json`);

//function emoji (id) {
 //   return client.emojis.get(id).toString();
//}

bot.on('message', async message =>{
    let prefix = config.prefix;

    if(message.content.startsWith(prefix+"say")){
      message.delete();
      message.channel.send(message.content.substr(5,));
      return;
    }

    if((message.content == '<:PepeClown:639853117843963914>' || message.content == '<:PepeClown:589995752093253632>')  && message.author.id == '249514842703003648'){
		message.channel.send( {files: ['./pepeclown.gif']} )
    return;
    }

    if(message.content == (prefix+"gif")){
      number=4;
      gifNumber = Math.floor(Math.random() * (number - 1 + 1)) + 1;
      message.channel.send( {files: ["./gif/"+ gifNumber + ".gif"]} )
      return;
    }

    if(message.content == "rainbow" && message.author.id == '249514842703003648'){
      message.delete();
      message.channel.send('<a:Rainbow:552553091686334498>');
      return;
    }

    if(message.content == 'PepeClown' && message.author.id == '249514842703003648'){
      message.channel.send( {files: ['./rip.png']} )
      return;
    }
});

bot.login(config.token);
bot.on('ready', ()=>{
    console.log(bot.user.username + ' online');
    bot.user.setPresence({status: 'online', game:{name: 'с твоей мамашей', type: 0}});
});