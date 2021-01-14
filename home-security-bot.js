require('dotenv').config();
const { Client, MessageEmbed } = require('discord.js');
const readLastLines = require('read-last-lines');
const bot = new Client();

let alarmStatus = 'off';
let doorStatus = 'closed';
let windowStatus = 'closed';
let lightStatus = 'off';

bot.login(process.env.BOT_TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  const args = msg.content.slice(1).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'help') {
    const helpEmbed = new MessageEmbed()
      .setColor('#03fcb6')
      .attachFiles(['./assets/avatar.png'])
      .setAuthor('Home Security Bot', 'attachment://avatar.png')
      .setDescription('Home Security Bot is a surveillance bot that allows you to keep an eye on your home when you are away from home. \n\nHere is the list of the available commands:\n')
      .addFields(
        { name: ':question: $help', value: 'lists all of the available commands' },
        { name: ':page_facing_up: $status [doors/windows/lights]', value: 'shows the status of all the doors, windows and lights of your home' },
        { name: ':thermometer: $temperature', value: 'gives the current temperature of your home' },
        { name: ':droplet: $humidity', value: 'gives the current humidity level of your home' },
        { name: ':camera: $snapshot', value: 'sends you a current image of your home' },
        { name: ':bulb: $lightplanning [hh:mm,hh:mm]', value: 'allows you to control the lights and schedule them when to turn on and off' },
        { name: ':lock: $alarm [on/off]', value: 'turning the alarm on will keep you notified of any intrusion into your home' },
        { name: ':notebook_with_decorative_cover: $logs [doors/windows/lights]', value: 'display the logs from all the sensors' },
      )
      .setTimestamp()
      .setFooter('home-security-bot', 'attachment://avatar.png');
    msg.channel.send(helpEmbed);
  }

  else if (command === 'status') {
    const statusEmbed = new MessageEmbed()
      .setColor('#03fcb6')
      .attachFiles(['./assets/avatar.png'])
      .setTimestamp()
      .setFooter('home-security-bot', 'attachment://avatar.png');
    if (!args.length) {
      statusEmbed.addFields(
        { name: ':door: Doors : ' + doorStatus, value: '\u200B' },
        { name: ':window: Windows : ' + windowStatus, value: '\u200B' },
        { name: ':bulb: Lights : ' + lightStatus, value: '\u200B' }
      );
    }
    else if (args[0] == 'doors')
      statusEmbed.addField(':door: Doors : ' + doorStatus, '\u200B');
    else if (args[0] == 'window')
      statusEmbed.addField(':window: Windows : ' + windowStatus, '\u200B');
    else if (args[0] == 'lights')
      statusEmbed.addField(':bulb: Lights : ' + lightStatus, '\u200B');
    else
      statusEmbed.addField(':no_entry_sign: Wrong argument: try $help', '\u200B');
    msg.channel.send(statusEmbed)
  }

  else if (command === 'temperature') {
    readLastLines.read('logs.txt', 1).then((line) => {
      let regex= /[#?&]([^=#]+)=([^&#]*)/g, params = {}, match;
      while (match = regex.exec(line))
        params[match[1]] = match[2];
      if (params.temperature)
        msg.channel.send(':thermometer: Current temperature : ' + params.temperature + '°C');
      else
      msg.channel.send(':thermometer: Error : arduino not started!');
    }).catch((e) => {
      msg.channel.send(':thermometer: Error : arduino not started!');
    })
  }

  else if (command === 'humidity') {
    readLastLines.read('logs.txt', 1).then((line) => {
      let regex= /[#?&]([^=#]+)=([^&#]*)/g, params = {}, match;
      while (match = regex.exec(line))
        params[match[1]] = match[2];
      if (params.humidity)
        msg.channel.send(':droplet: Current humidity level : ' + params.humidity + '%');
      else
        msg.channel.send(':droplet: Error : arduino not started!');
    }).catch((e) => {
      msg.channel.send(':droplet: Error : arduino not started!');
    })
  }

  else if (command === 'snapshot') {
    const snapshotEmbed = new MessageEmbed()
      .setColor('#03fcb6')
      .attachFiles(['./assets/home.png'])
      .setImage('attachment://home.png')
      .setTimestamp()
      .setFooter('home-security-bot');
    msg.channel.send(snapshotEmbed);
  }

  else if (command === 'lightplanning') {
    msg.channel.send(':bulb: Home Lights :' + lightStatus);
  }

  else if (command === 'alarm') {
    if (!args.length)
      return msg.channel.send(':unlock: Alarm is currently ' + alarmStatus);
    if (args.length > 1)
      return msg.channel.send('Too many arguments!');
    if (args[0] === 'on') {
      alarmStatus = 'on';
      return msg.channel.send(':lock: Alarm is now ' + alarmStatus);
    }
    if (args[0] === 'off') {
      alarmStatus = 'off';
      return msg.channel.send(':lock: Alarm is now ' + alarmStatus);
    }
  }

  else if (command === 'logs') {
    readLastLines.read('logs.txt', 20).then((lines) => {
      lines.replace("&", " ");
      lines.replace("=", ":");
      msg.channel.send(lines);
    }).catch((e) => {
      msg.channel.send(':droplet: Error : arduino not started!');
    })
  }
});