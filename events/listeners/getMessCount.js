const mongo = require("../../handlers/mongo");
const settingsMessCountSchema = require("../../schemas/setting_schema");
let status

module.exports = async (message) => {
  const guildID = message.guild.id
  await mongo().then(async (mongoose) => {
    try {      
        let data = await settingsMessCountSchema.findOne({ _id: guildID });
        status= data ? data.messageCounter : null 
    } finally {
      mongoose.connection.close;
    }
  });
  return status
};