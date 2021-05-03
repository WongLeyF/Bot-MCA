const mongoose = require("mongoose");
const reqString ={
    type: String,
    required: true
}
const messageCountSchema = mongoose.Schema({
  //The user ID
  guildId: String,
  userId: String,
  messageCount: Number
});
module.exports = mongoose.model("message_count", messageCountSchema);
