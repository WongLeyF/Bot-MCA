const mongo = require("./mongo");
const settingSchema = require("../../models/setting.model");
const settingsXP = require("../../models/settingsXP.model");
const userSettings = require("../../models/userSettings.model");
const { removeItemFromArr, simpleEmbedDescription } = require("../functions");
const { MessageEmbed } = require("discord.js");
const Widgets = require("../../modules/provider");


module.exports = {
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
  //return string with the id of log messages channel 
  getChannelLogsMessages: async function (message) {
    const guildID = message.guild.id
    let channelID
    await mongo().then(async (mongoose) => {
      try {
        let data = await settingSchema.findOne({ _id: guildID });
        channelID = data && data.logsMessages != "" && (data.logsMessages != undefined) ? data.logsMessages : message.channel.id
      } finally {
        mongoose.connection.close;
      }
    });
    return channelID
  },
  //return string with the id of log messages channel 
  getChannelLogsModeration: async function (message) {
    const guildID = message.guild.id
    let channelID
    await mongo().then(async (mongoose) => {
      try {
        let data = await settingSchema.findOne({ _id: guildID });
        channelID = data && data.logsModeration != "" && (data.logsModeration != undefined) ? data.logsModeration : message.channel.id
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
  //return boolean with the status of message counter
  getUpdateMessages: async function (message) {
    const guildID = message.guild.id
    await mongo().then(async (mongoose) => {
      try {
        let data = await settingSchema.findOne({ _id: guildID });
        status = data ? data.updatesMessages : null
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
  getRole: async function (message, req) {
    let role;
    if (isNaN(req)) role = await message.guild.roles.cache.find(c => c.id === req.slice(3, -1))
    if (!isNaN(req)) role = await message.guild.roles.cache.find(c => c.id === req)
    if (role == undefined) role = message.guild.roles.cache.find(c => c.name === req)
    return role
  },
  noXpRoles: async function (message, role, type) {
    const guildID = message.guild.id
    let status = false
    await mongo().then(async (mongoose) => {
      try {
        let data = await settingsXP.findOne({ _id: guildID });
        switch (type) {
          case 'add':
            if (data) {
              if (!data.noRoles.includes(role.id))
                data.noRoles.push(role.id)
              await data.save()
              status = true
            } else {
              const newData = new settingsXP({
                _id: guildID,
                noRoles: [role.id]
              })
              await newData.save()
              status = true
            }
            break;
          case 'remove':
            if (data) {
              if (data.noRoles.includes(role.id)) {
                const newArray = removeItemFromArr(data.noRoles, role.id)
                data.noRoles = newArray
                await data.save()
                status = true
              }
            }

            break;
          case 'list':
            if (data) {
              let options = new Widgets.MenuRolesXP.dropdownroles()
              await message.guild.roles.cache.filter(f => data.noRoles.includes(f.id)).map(m => {
                options.addrole({
                  label: m.name,
                  role: m.id,
                  emoji: '📍'
                })
              });
              if (options.roles.length === 0)
                return simpleEmbedDescription(message, 'RED', 10000, '❌ No encontre nada en la lista');
              Widgets.MenuRolesXP.dropdownroles.create({
                message: message,
                role: options, /*dropdownroles constructor*/
                content: new MessageEmbed().setDescription('⚠️ **Roles que no reciben experiencia**').setColor("YELLOW"),
                channelID: message.channel.id
              });
              status = true
            } else return simpleEmbedDescription(message, 'RED', 10000, '❌ No encontre nada en la lista');
            break;
          case 'remove-all':
            const newArray = []
            data.noRoles = newArray
            await data.save()
            status = true
            break;
        }
      } finally {
        mongoose.connection.close;
      }
    });
    return status
  }
}