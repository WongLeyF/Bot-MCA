const mongoose = require('mongoose')
//delete mongoose.connection.models['settingXP'];
const settingsXP = mongoose.Schema({

    _id: {
        type: String,
        required: true
    },
    min_xp: { type: Number, default: 10 },
    max_xp: { type: Number, default: 30 },
    cooldown: { type: Number, default: 60 },
    noChannels: {type: Array},
    noRoles: {type: Array}
});

module.exports = mongoose.model('settingsXP', settingsXP)