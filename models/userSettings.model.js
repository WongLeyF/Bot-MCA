const mongoose = require("mongoose");
const reqString ={
    type: String,
    required: true
}
const userSettings = mongoose.Schema({
  //The user ID
  guildId: reqString,
  userId: reqString,
  colorBar: { type: String },
  colorStatus: {type: String},
  imgRank: { type: String },
  colorBackground: { type: String }
  
});
module.exports = mongoose.model("usersettings", userSettings);
