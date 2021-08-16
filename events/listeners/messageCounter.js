const mongo = require("../../handlers/mongo/mongo");
const messageCountSchema = require("../../models/messageCount.model");

module.exports = async (message) => {
  const { author } = message;
  const guildID = message.guild.id;
  const { id } = author;
  messageCountSchema.findOne({ userId: id, guildId: guildID }, (err, res) => {
    if (res){
      res.messageCount += 1
      res.save()
    }else{
      const newData = new messageCountSchema({
        userId: id,
        guildId: guildID,
        messageCount: 1,
      });
      newData.save()
    }
  });
};
