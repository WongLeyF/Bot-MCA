const mongoose = require("mongoose");
const reqString ={
    type: String,
    required: true
}
const messageCount = mongoose.Schema({
  //The user ID
  guildId: String,
  userId: String,
  messageCount: Number
});
module.exports = mongoose.model("message_count", messageCount);
