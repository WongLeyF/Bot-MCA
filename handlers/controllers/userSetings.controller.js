const userSettings = require("../../models/userSettings.model");

module.exports = {
    getUserSettings: async (message, userID) => {
        const guildID = message.guild.id
        return userSettings.findOne({ guildId: guildID, userId: userID });
    },
}