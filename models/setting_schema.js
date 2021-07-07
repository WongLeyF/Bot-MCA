const mongoose = require('mongoose')

const settingsSchema = mongoose.Schema({

    _id: {
        type: String,
        required: true
    },
    prefix: { type: String },
    generalLog: { type: String },
    editDeleteLog: { type: String },
    levelChannel: { type: String },
    confessionChannel: { type: String },
    warnsChannel: { type: String },
    messageCounter: { type: Boolean },
    levelSystem: { type: Boolean, default: false },
    logsMessages: { type: String},
    logsModeration: { type: String},
    updatesMessages: {type: Boolean, default: false}

})

module.exports = mongoose.model('settings', settingsSchema)