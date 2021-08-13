const userSettings = require("../../models/userSettings.model");
const mongo = require("../mongo/mongo");

module.exports = {
    getUserSettings: async (message, userID) => {
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
}