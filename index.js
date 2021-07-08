//Importing all needed Commands
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const colors = require("colors"); //this Package is used, to change the colors of our Console! (optional and doesnt effect performance)
const fs = require("fs"); //this package is for reading files and getting their inputs
const dotenv = require('dotenv').config();

//Creating the Discord.js Client for This Bot with some default settings ;) and with partials, so you can fetch OLD messages
const client = new Discord.Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

//Client variables to use everywhere
client.commands = new Discord.Collection(); //an collection (like a digital map(database)) for all your commands
client.aliases = new Discord.Collection(); //an collection for all your command-aliases
client.categories = fs.readdirSync("./commands/"); //categories
client.cooldowns = new Discord.Collection(); //an collection for cooldown commands of each user
client.cooldownXP = new Discord.Collection(); //an collection for cooldown XP of each user
require("discord-xp").setURL(process.env.mongoPath);
require('discord-buttons')(client);
//Loading files, with the client variable like Command Handler, Event Handler, ...
["command", "events"].map(handler => {
    require(`./handlers/${handler}`)(client);
});

//login into the bot
client.login(process.env.token);

process.on('SIGINT', function () {
  console.log(`You have been disconnected at ${new Date()}.`.red)
});