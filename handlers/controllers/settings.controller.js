const settingSchema = require("../../models/setting.model");

module.exports = {
    //return string with the id of confession channel 
    getChannelConfession: async (message) => {
        const guildID = message.guild.id
        const result = settingSchema.findOne({ _id: guildID });
        return result.confessionChannel
    },
    //return string with the id of level channel 
    getChannelLevels: async (message) => {
        const guildID = message.guild.id
        const result = settingSchema.findOne({ _id: guildID });
        return result && result.levelChannel != "" && (result.levelChannel != undefined) ? result.levelChannel : message.channel.id
    },
    //return string with the id of log messages channel 
    getChannelLogsMessages: async (message) => {
        const guildID = message.guild.id
        const result = settingSchema.findOne({ _id: guildID });
        return result && result.logsMessages != "" && (result.logsMessages != undefined) ? result.logsMessages : message.channel.id
    },
    //return string with the id of log messages channel 
    getChannelLogsModeration: async (message) => {
        const guildID = message.guild.id
        const result = settingSchema.findOne({ _id: guildID });
        return result && result.logsModeration != "" && (result.logsModeration != undefined) ? result.logsModeration : message.channel.id
    },
    //return boolean with the status of message counter
    getMessageCount: async (message) => {
        const guildID = message.guild.id
        const result = settingSchema.findOne({ _id: guildID });
        return result.messageCounter
    },
    //return boolean with the status of message counter
    getUpdateMessages: async (message) => {
        const guildID = message.guild.id
        const result = settingSchema.findOne({ _id: guildID });
        return result.updatesMessages
    },
    //return boolean with the status of levels system
    getLevelSystem: async (message) => {
        const guildID = message.guild.id
        const result = settingSchema.findOne({ _id: guildID });
        return result.levelSystem
    },
    //return string with the prefix of guild
    getPrefix: async (message) => {
        const guildID = message.guild.id
        const result = await settingSchema.findOne({ _id: guildID });
        return result.prefix
    },
}