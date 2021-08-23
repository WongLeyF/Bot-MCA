const { MessageEmbed, WebhookClient, Message } = require("discord.js")
const ee = require("../json/embed.json")
const gm = require("../json/globalMessages.json")
const Levels = require("discord-xp");
const https = require('https')
const Stream = require('stream').Transform
const fs = require('fs');
const webHookMain = new WebhookClient({
  id: process.env.webhookID,
  token: process.env.webhookToken
})

module.exports = {
  //get a member lol
  getMember: (message, toFind = "") => {
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
  getRole: async (message, req) => {
    let role;
    if (isNaN(req)) role = await message.guild.roles.cache.find(c => c.id === req.slice(3, -1))
    if (!isNaN(req)) role = await message.guild.roles.cache.find(c => c.id === req)
    if (role == undefined) role = message.guild.roles.cache.find(c => c.name === req)
    return role
  },

  getLeaderboard: async function (client, message) {
    const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10); // We grab top 10 users with most xp in the current server.
    if (rawLeaderboard.length < 1) return message.reply({embeds: [new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription('❌ Nadie está en el leaderboard todavía.')
    ]}).then(msg => setTimeout(() => msg.delete(), 5000)).catch(e => console.log(gm.errorDeleteMessage.gray));
    const embed = new MessageEmbed().setTitle("**Leaderboard**:")
    const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.
    const lb = leaderboard.map(e => embed.addField(`**${e.position}. ${e.username}#${e.discriminator}**`, `Level: ${e.level}  -  XP: ${e.xp.toLocaleString()}`)); // We map the outputs.
    //message.channel.send(`**Leaderboard**:\n\n${lb.join("\n\n")}`);
    message.channel.send({ embeds: [embed] })
  },
  getLeaderboardRange: async function (client, message, init) {
    const start = parseInt(init)
    const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, start + 10); // We grab top 10 users with most xp in the current server.
    if (rawLeaderboard.length + 10 <= 0) return message.reply({
      embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription('❌ Nadie está en el leaderboard todavía.')
      ]
    }).then(msg => setTimeout(() => msg.delete(), 5000)).catch(e => console.log(gm.errorDeleteMessage.gray));
    const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.
    const embed = new MessageEmbed().setTitle("**Leaderboard**:")
    const lb = leaderboard.filter(e => e.position >= init).map(e => embed.addField(`**${e.position}. ${e.username}#${e.discriminator}**`, `Level: ${e.level}  -  XP: ${e.xp.toLocaleString()}`)); // We map the outputs.
    //message.channel.send(`**Leaderboard**:\n\n${lb.join("\n\n")}`);
    if (lb.length > 0) {
      message.channel.send({ embeds: [embed] })
    } else {
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription('❌ Nadie está en esta leaderboard todavía.')
      ]}).then(msg => setTimeout(() => msg.delete(), 5000)).catch(e => console.log(gm.errorDeleteMessage.gray));
    }
  },
  getLeaderboardSpecific: async function (client, guildID, userID) {
    const rawLeaderboard = await Levels.fetchLeaderboard(guildID, 9999);
    const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard); // We process the leaderboard.
    const lb = leaderboard.find(e => e.userID == userID);
    return Number(lb?.position || null)
  },
  removeItemFromArr: function (arr, item) {
    return arr.filter(function (e) {
      return e !== item;
    });
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

  errorMessageEmbed: function (e, message) {
    const embed = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(ee.footertext, ee.footericon)
      .setTitle(gm.titleError)
      .setDescription(`\`\`\`${e.stack}\`\`\``);
    webHookMain.send({
      username: message.guild.name,
      avatarURL: message.guild.iconURL({ dynamic: true }),
      embeds: [embed],
    });
  },
  simpleEmbedField: function (message, color, time, title, description) {
    if (time) {
      message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(color)
          .addField(`${title}`, `${description}`)
        ]
      }).then(msg => setTimeout(() => msg.delete(), time)).catch(e => console.log(gm.errorDeleteMessage.gray));
    } else {
      message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(color)
          .addField(`${title}`, `${description}`)
        ]
      });
    }
  },
  simpleEmbedDescription: function (message, color, time = null, description, reply=false) {
    let contain = {
      embeds: [new MessageEmbed()
        .setColor(color)
        .setDescription(`${description}`)
      ]
    }
    if(reply){
      contain.reply = { messageReference: message.id }
    }
    if (time) {
      message.channel.send(contain).then(msg => setTimeout(() => msg.delete(), time)).catch(e => console.log(gm.errorDeleteMessage.gray));
    } else {
      message.channel.send(contain);
    }
  },
  downloadImageToUrl: async function (url, filename) {
    https.request(url, function (response) {
      let data = new Stream();

      response.on('data', function (chunk) {
        data.push(chunk);
      });

      response.on('end', function () {
        fs.writeFileSync(`.temp/${filename}.png`, data.read());
      });
    }).end()
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
      this.webHookErrorMessage(e)
    }
  },

  webHookErrorMessage: function (e, title) {
    const embed = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(ee.footertext, ee.footericon)
      .setTitle(title)
      .setDescription(`\`\`\`${e.stack}\`\`\``);
    webHookMain.send({
      username: "Critical Error",
      avatarURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Warning.svg/520px-Warning.svg.png",
      embeds: [embed],
    });
  },

}




