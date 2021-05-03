const mongo = require("../../handlers/mongo");
const messageCountSchema = require("../../models/messageCount_schema");

module.exports = async (message) => {
  const { author } = message;
  const guildID = message.guild.id;
  const { id } = author;
  await mongo().then(async (mongoose) => {
    try {
      let user = await messageCountSchema.findOne({ userId: id, guildId: guildID });
      if (user){
        user.messageCount += 1
        await user.save()
      }else{
        let newData = new messageCountSchema({
          userId: id,
          guildId: guildID,
          messageCount: 1,
        });
        await newData.save()
      }
    } finally {
      mongoose.connection.close;
    }
  });
};
