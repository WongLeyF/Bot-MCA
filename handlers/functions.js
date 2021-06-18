const mongo = require("../handlers/mongo");
const { MessageEmbed } = require("discord.js")
const ee = require("../botconfig/embed.json")
const settingSchema = require("../models/setting_schema");
const settingsXP = require("../models/settingsxp");
const userSettings = require("../models/usersettings");
const Levels = require("discord-xp");

module.exports = {
  //get a member lol
  getMember: function (message, toFind = "") {
    try {
      toFind = toFind.toLowerCase();
      let target = message.guild.members.cache.get(toFind);
      if (!target && message.mentions.members) target = message.mentions.members.first();
      if (!target && toFind) {
        target = message.guild.members.fetch((member) => {
          return member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind);
        });
      }
      if (!target) target = message.member;
      return target;
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  //return string with the id of confession channel 
  getChannelConfession: async function (message) {
    const guildID = message.guild.id
    let channelID
    await mongo().then(async (mongoose) => {
      try {
        let data = await settingSchema.findOne({ _id: guildID });
        channelID = data ? data.confessionChannel : null
      } finally {
        mongoose.connection.close;
      }
    });
    return channelID
  },
  //return string with the id of level channel 
  getChannelLevels: async function (message) {
    const guildID = message.guild.id
    let channelID
    await mongo().then(async (mongoose) => {
      try {
        let data = await settingSchema.findOne({ _id: guildID });
        channelID = data && data.levelChannel != "" && (data.levelChannel != undefined) ? data.levelChannel : message.channel.id
      } finally {
        mongoose.connection.close;
      }
    });
    return channelID
  },
  //return object with the user settings
  getUserSettings: async function (message, userID) {
    const guildID = message.guild.id
    let userSett
    await mongo().then(async (mongoose) => {
      try {
        userSett = await userSettings.findOne({ guildId: guildID, userId: userID });
      } finally {
        mongoose.connection.close;
      }
    });
    return userSett
  },
  //return boolean with the status of message counter
  getMessageCount: async function (message) {
    const guildID = message.guild.id
    await mongo().then(async (mongoose) => {
      try {
        let data = await settingSchema.findOne({ _id: guildID });
        status = data ? data.messageCounter : null
      } finally {
        mongoose.connection.close;
      }
    });
    return status
  },
  //return boolean with the status of levels system
  getLevelSystem: async function (message) {
    const guildID = message.guild.id
    await mongo().then(async (mongoose) => {
      try {
        let data = await settingSchema.findOne({ _id: guildID });
        status = data ? data.levelSystem : null
      } finally {
        mongoose.connection.close;
      }
    });
    return status
  },
  //return string with the prefix of guild
  getPrefix: async function (message) {
    const guildID = message.guild.id
    await mongo().then(async (mongoose) => {
      try {
        let data = await settingSchema.findOne({ _id: guildID });
        guildPrefixes = data ? data.prefix : null
      } finally {
        mongoose.connection.close;
      }
    });
    return guildPrefixes
  },
  getlvlcooldown: async function (message) {
    const guildID = message.guild.id
    await mongo().then(async (mongoose) => {
      try {
        let data = await settingsXP.findOne({ _id: guildID });
        lvlsettings = data ? data.cooldown : null
      } finally {
        mongoose.connection.close;
      }
    });
    return lvlsettings
  },
  getlvlsettings: async function (message) {
    const guildID = message.guild.id
    await mongo().then(async (mongoose) => {
      try {
        let data = await settingsXP.findOne({ _id: guildID });
        lvlsettings = data ? data : null
      } finally {
        mongoose.connection.close;
      }
    });
    return lvlsettings
  },
  getLeaderboard: async function (client, message) {
    const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10); // We grab top 10 users with most xp in the current server.
    if (rawLeaderboard.length < 1)  return message.reply(new MessageEmbed()
    .setColor(ee.wrongcolor)
    .setDescription('❌ Nadie está en el leaderboard todavía.')
  ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
    const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.
    const lb = leaderboard.map(e => `**${e.position}. ${e.username}#${e.discriminator}**\nLevel: ${e.level}  -  XP: ${e.xp.toLocaleString()}`); // We map the outputs.
    //message.channel.send(`**Leaderboard**:\n\n${lb.join("\n\n")}`);
    message.channel.send(new MessageEmbed()
      .setTitle("**Leaderboard**:")
      .setDescription(`\n${lb.join("\n\n")}`)
    )
  },
  getLeaderboardRange: async function (client, message, init) {
    const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, init + 10); // We grab top 10 users with most xp in the current server.
    if (rawLeaderboard.length < 1) return message.reply(new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription('❌ Nadie está en el leaderboard todavía.')
    ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
    const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.
    const lb = leaderboard.map(e => `**${e.position}. ${e.username}#${e.discriminator}**\nLevel: ${e.level}  -  XP: ${e.xp.toLocaleString()}`); // We map the outputs.
    //message.channel.send(`**Leaderboard**:\n\n${lb.join("\n\n")}`);
    if (lb[init-1] != null) message.channel.send(new MessageEmbed()
      .setTitle("**Leaderboard**:")
      .setDescription(`\n${lb.slice(init - 1).join("\n\n")}`)
    ); else return message.channel.send(new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription('❌ Nadie está en el leaderboard todavía.')
    ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
  },
  getLeaderboardSpecific: async function (client, guildID, userID) {
    const rawLeaderboard = await Levels.fetchLeaderboard(guildID, 999999);
    const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.
    const lb = leaderboard.find(e => e.userID == userID);
    return Number(lb.position ? lb.position : null)
  },
  //changeging the duration from ms to a date
  duration: function (ms) {
    const sec = Math.floor((ms / 1000) % 60).toString();
    const min = Math.floor((ms / (60 * 1000)) % 60).toString();
    const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString();
    const days = Math.floor((ms / (24 * 60 * 60 * 1000)) % 60).toString();
    return `\`${days}Days\`,\`${hrs}Hours\`,\`${min}Minutes\`,\`${sec}Seconds\``;
  },
  //function for awaiting reactions
  promptMessage: async function (message, author, time, validReactions) {
    try {
      time *= 1000;
      for (const reaction of validReactions) await message.react(reaction);
      const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
      return message.awaitReactions(filter, {
        max: 1,
        time: time
      }).then((collected) => collected.first() && collected.first().emoji.name);
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  //Function to wait some time
  delay: function (delayInms) {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  //randomnumber between 0 and x
  getRandomInt: function (max) {
    try {
      return Math.floor(Math.random() * Math.floor(max));
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  //random number between y and x
  getRandomNum: function (min, max) {
    try {
      return Math.floor(Math.random() * (max - min + 1) + min);
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  //function for creating a bar
  createBar: function (maxtime, currenttime, size = 25, line = "▬", slider = "🔶") {
    try {
      let bar = currenttime > maxtime ? [line.repeat(size / 2 * 2), (currenttime / maxtime) * 100] : [line.repeat(Math.round(size / 2 * (currenttime / maxtime))).replace(/.$/, slider) + line.repeat(size - Math.round(size * (currenttime / maxtime)) + 1), currenttime / maxtime];
      if (!String(bar).includes("🔶")) return `**[🔶${line.repeat(size - 1)}]**\n**00:00:00 / 00:00:00**`;
      return `**[${bar[0]}]**\n**${new Date(currenttime).toISOString().substr(11, 8) + " / " + (maxtime == 0 ? " ◉ LIVE" : new Date(maxtime).toISOString().substr(11, 8))}**`;
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  format: function (millis) {
    try {
      var h = Math.floor(millis / 3600000),
        m = Math.floor(millis / 60000),
        s = ((millis % 60000) / 1000).toFixed(0);
      if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
      else return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  escapeRegex: function (str) {
    try {
      return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  arrayMove: function (array, from, to) {
    try {
      array = [...array];
      const startIndex = from < 0 ? array.length + from : from;
      if (startIndex >= 0 && startIndex < array.length) {
        const endIndex = to < 0 ? array.length + to : to;
        const [item] = array.splice(from, 1);
        array.splice(endIndex, 0, item);
      }
      return array;
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}


