const mongoose = require('mongoose')

const settings = mongoose.Schema({

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
    updatesMessages: {type: Boolean, default: false},
    reactionMenus: [{
        _id: { type: Number,
            unique: true
        },
        name: { type: String },
        placeholder: { type: String },
        title: { type: Boolean, default: true },
        reactionRoles: [{
            emoji: { type: String },
            role: { type: String },
            description: { type: String },
        }],
    }],

})

module.exports = mongoose.model('settings', settings)