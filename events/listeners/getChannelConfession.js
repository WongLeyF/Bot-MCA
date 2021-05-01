const mongo = require("../../handlers/mongo");
const settingsConffesionSchema = require("../../schemas/setting_schema");
let channelID

module.exports = async (message) => {
  const guildID = message.guild.id
  await mongo().then(async (mongoose) => {
    try {      
        let data = await settingsConffesionSchema.findOne({ _id: guildID });
        channelID= data ? data.confessionChannel : null 
    } finally {
      mongoose.connection.close;
    }
  });
  return channelID
};