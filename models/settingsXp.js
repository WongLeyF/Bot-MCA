const mongoose = require('mongoose')

const settingsXP = mongoose.Schema({

    _id: {
        type: String,
        required: true
    },
    min_xp: { type: Number },
    max_xp: { type: Number },
    cooldown: { type: Number }
});

module.exports = mongoose.model('settingXP', settingsXP)