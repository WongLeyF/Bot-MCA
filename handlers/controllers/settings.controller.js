const settingSchema = require("../../models/setting.model");
const mongo = require("../mongo/mongo");

module.exports = {
    //return string with the id of confession channel 
    getChannelConfession: async (message) => {
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
    getChannelLevels: async (message) => {
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
    getChannelLogsMessages: async (message) => {
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
    getChannelLogsModeration: async (message) => {
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
    //return boolean with the status of message counter
    getMessageCount: async (message) => {
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
    getUpdateMessages: async (message) => {
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
    getLevelSystem: async (message) => {
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
    getPrefix: async (message) => {
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
}