require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();


bot.login(process.env.BOT_TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
  });

bot.on('message', msg => {
  if (msg.content === '$help') {
    msg.reply('yes?');
  }
});