const settingSchema = require("../../models/setting.model");

module.exports = {
    //return string with the id of confession channel 
    getChannelConfession: async (message) => {
        const guildID = message.guild.id
        settingSchema.findOne({ _id: guildID }, (err, res) => {
            if (res) {
                return  res ? res.confessionChannel : null
            }
        });
        return;
    },
    //return string with the id of level channel 
    getChannelLevels: async (message) => {
        const guildID = message.guild.id
        settingSchema.findOne({ _id: guildID }, (err, res) => {
            if (res) {
                return res && res.levelChannel != "" && (res.levelChannel != undefined) ? res.levelChannel : message.channel.id
            }
        });
        return;
    },
    //return string with the id of log messages channel 
    getChannelLogsMessages: async (message) => {
        const guildID = message.guild.id
        settingSchema.findOne({ _id: guildID }, (err, res) => {
            if (res) {
                return res && res.logsMessages != "" && (res.logsMessages != undefined) ? res.logsMessages : message.channel.id
            }
        })
        return;
    },
    //return string with the id of log messages channel 
    getChannelLogsModeration: async (message) => {
        const guildID = message.guild.id
        settingSchema.findOne({ _id: guildID }, (err, res) => {
            if (res) {
                return  res && res.logsModeration != "" && (res.logsModeration != undefined) ? res.logsModeration : message.channel.id
            }
        });
        return;
    },
    //return boolean with the status of message counter
    getMessageCount: async (message) => {
        const guildID = message.guild.id
        settingSchema.findOne({ _id: guildID }, (err, res) => {
            if (res) {
                return  res ? res.messageCounter : null
            }
        });
        return;
    },
    //return boolean with the status of message counter
    getUpdateMessages: async (message) => {
        const guildID = message.guild.id
        settingSchema.findOne({ _id: guildID }, (err, res) => {
            if (res) {
                return res ? res.updatesMessages : null
            }
        });
        return;
    },
    //return boolean with the status of levels system
    getLevelSystem: async (message) => {
        const guildID = message.guild.id
        settingSchema.findOne({ _id: guildID }, (err, res) => {
            if (res) {
                return res ? res.levelSystem : null
            }
        });
        return;
    },
    //return string with the prefix of guild
    getPrefix: async (message) => {
        const guildID = message.guild.id
        settingSchema.findOne({ _id: guildID }, (err, res) => {
            if (res) {
                return res ? res.prefix : null
            }
        });
        return;
    },
}