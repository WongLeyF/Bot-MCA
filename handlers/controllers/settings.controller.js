const settingSchema = require("../../models/setting.model");

module.exports = {
    //return string with the id of confession channel 
    getChannelConfession: async (message) => {
        const guildID = message.guild.id
        let result
        await settingSchema.findOne({ _id: guildID }).then( res => {
            result = res?.confessionChannel
        });
        return result
    },
    //return string with the id of level channel 
    getChannelLevels: async (message) => {
        const guildID = message.guild.id
        await settingSchema.findOne({ _id: guildID }).then( res => {
            result = res?.levelChannel
        });
        return result ? result : message.channel.id
    },
    //return string with the id of log messages channel 
    getChannelLogsMessages: async (message) => {
        const guildID = message.guild.id
        let result
        await settingSchema.findOne({ _id: guildID }).then( res => {
            result = res?.logsMessages
        });
        return result
    },
    //return string with the id of log messages channel 
    getChannelLogsModeration: async (message) => {
        const guildID = message.guild.id
        let result
        await settingSchema.findOne({ _id: guildID }).then( res => {
            result = res?.logsMessages
        });
        return result
    },
    //return boolean with the status of message counter
    getMessageCount: async (message) => {
        const guildID = message.guild.id
        let result
        await settingSchema.findOne({ _id: guildID }).then( res => {
            result = res?.messageCounter ? true : false
        });
        return result
    },
    //return boolean with the status of message counter
    getUpdateMessages: async (message) => {
        const guildID = message.guild.id
        let result
        await settingSchema.findOne({ _id: guildID }).then( res => {
            result = res?.updatesMessages ? true : false
        });
        return result
    },
    //return boolean with the status of levels system
    getLevelSystem: async (message) => {
        const guildID = message.guild.id
        let result
        await settingSchema.findOne({ _id: guildID }).then( res => {
            result = res?.levelSystem ? true : false
        });
        return result
    },
    //return string with the prefix of guild
    getPrefix: async (message) => {
        const guildID = message.guild.id
        let result
        await await settingSchema.findOne({ _id: guildID }).then( res => {
            result = res?.prefix
        });
        return result
    },
}