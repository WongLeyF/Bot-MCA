const mongo = require("../../handlers/mongo");
const settingPrefixSchema = require("../../schemas/setting_schema");
let guildPrefixes

module.exports = async (message) => {
  const guildID = message.guild.id
  await mongo().then(async (mongoose) => {
    try {      
        let dataPrefix = await settingPrefixSchema.findOne({ _id: guildID });
        guildPrefixes= dataPrefix ? dataPrefix.prefix : null 
    } finally {
      mongoose.connection.close;
    }
  });
  return guildPrefixes
};