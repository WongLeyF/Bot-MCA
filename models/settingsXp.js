const mongoose = require('mongoose')

const settingsSchema = mongoose.Schema({

    _id: {
        type: String,
        required: true
    },
    min_xp: { type: Number },
    max_xp: { type: Number },
    cooldown: { type: Number },
    levelChannel: { type: String },
    confessionChannel: { type: String },
    warnsChannel: { type: String },
    messageCounter: { type: Boolean },
    levelSystem: { type: Boolean }

})

module.exports = mongoose.model('settings', settingsSchema)