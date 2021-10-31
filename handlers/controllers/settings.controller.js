const settingSchema = require("../../models/setting.model");

module.exports = {
    //return string with the id of confession channel 
    getChannelConfession: async (message) => {
        const guildID = message.guild.id
        let result
        await settingSchema.findOne({ _id: guildID }, { confessionChannel: 1 }).then( res => {
            result = res?.confessionChannel
        });
        return result
    },
    //return string with the id of level channel 
    getChannelLevels: async (message) => {
        const guildID = message.guild.id
        await settingSchema.findOne({ _id: guildID }, { levelChannel: 1 }).then( res => {
            result = res?.levelChannel
        });
        return result ? result : message.channel.id
    },
    //return string with the id of log messages channel 
    getChannelLogsMessages: async (message) => {
        const guildID = message.guild.id
        let result
        await settingSchema.findOne({ _id: guildID }, { logsMessages: 1 }).then( res => {
            result = res?.logsMessages
        });
        return result
    },
    //return string with the id of log messages channel 
    getChannelLogsModeration: async (message) => {
        const guildID = message.guild.id
        let result
        await settingSchema.findOne({ _id: guildID }, { logsMessages: 1 }).then( res => {
            result = res?.logsMessages
        });
        return result
    },
    //return boolean with the status of message counter
    getMessageCount: async (message) => {
        const guildID = message.guild.id
        let result
        await settingSchema.findOne({ _id: guildID }, { messageCounter: 1 }).then( res => {
            result = res?.messageCounter ? true : false
        });
        return result
    },
    //return boolean with the status of message counter
    getUpdateMessages: async (message) => {
        const guildID = message.guild.id
        let result
        await settingSchema.findOne({ _id: guildID }, { updatesMessages: 1 }).then( res => {
            result = res?.updatesMessages ? true : false
        });
        return result
    },
    //return boolean with the status of levels system
    getLevelSystem: async (message) => {
        const guildID = message.guild.id
        let result
        await settingSchema.findOne({ _id: guildID }, { levelSystem: 1 }).then( res => {
            result = res?.levelSystem ? true : false
        });
        return result
    },
    //return string with the prefix of guild
    getPrefix: async (message) => {
        const guildID = message.guild.id
        let result
        await await settingSchema.findOne({ _id: guildID }, { prefix: 1 }).then( res => {
            result = res?.prefix
        });
        return result
    },

    //return reaction menu by id of guild and id of menu
    getReactionMenuById: async (message, menuID) => {
        const guildID = message.guild.id
        let result
        await settingSchema.findOne({
            _id: `${guildID}`, "reactionMenus._id": menuID
         },
         { 
            reactionMenus: 1
        }).then( res => {
            // console.log(res.reactionMenus) 
            result = res?.reactionMenus.find(x => x._id == menuID)
            // console.log(result)
        });
        return result
    },

    // return array of reactions menu by id of guild
    getReactionMenus: async (message) => {
        const guildID = message.guild.id
        let result
        await settingSchema.findOne({ _id: guildID }, { reactionMenus: 1 }).then( res => {
            result = res?.reactionMenus
        });
        return result
    },

    updateMenuRole: async (message, menuID, roleID, emoji, description) => {
        const guildID = message.guild.id

        await settingSchema.findOne({
            _id: `${guildID}`, "reactionMenus._id": menuID
        },
        {
            reactionMenus: 1
        }, (err, res) => {
            if (err) console.log(err)
            if (res) {
                // console.log("Found")
                indexMenu = res.reactionMenus.indexOf(res.reactionMenus.find(x => x._id == menuID))
                const optionRole = res.reactionMenus[indexMenu].reactionRoles.find(x => x.role == roleID)
                if (optionRole) {
                    // console.log("Found role")
                    indexRole = res.reactionMenus[indexMenu].reactionRoles.indexOf(optionRole)
                    res.reactionMenus[indexMenu].reactionRoles[indexRole].emoji = emoji
                    res.reactionMenus[indexMenu].reactionRoles[indexRole].description = description

                    res.save()
                } else {
                    // console.log("Not found role")
                    res.reactionMenus[indexMenu].reactionRoles.push({
                        role: roleID,
                        emoji: emoji,
                        description: description
                    })
                    res.save()
                }
            }
        })
    },
    saveMenu: async (message, menuID, options) => {
        const guildID = message.guild.id

        await settingSchema.findOne({
            _id: `${guildID}`, "reactionMenus._id": menuID
        },
        {
            reactionMenus: 1
        }, (err, res) => {
            if (err) console.log(err)
            if (res) {
                // console.log("Found")
                // console.log(res.reactionMenus[indexMenu].name,options?.name)
                const indexMenu = res.reactionMenus.indexOf(res.reactionMenus.find(x => x._id == menuID))
                res.reactionMenus[indexMenu].name = options?.name
                res.reactionMenus[indexMenu].placeholder = options?.placeholder
                res.reactionMenus[indexMenu].title = options?.title
                res.save()
                // console.log(res.reactionMenus[indexMenu])
            }
        })
    },
    delMenu: async (message, menuID) => {
        const guildID = message.guild.id

        await settingSchema.findOne({
            _id: `${guildID}`, "reactionMenus._id": menuID
        },
        {
            reactionMenus: 1
        }, (err, res) => {
            if (err) console.log(err)
            if (res) {
                // console.log("Found")
                // console.log(res.reactionMenus[indexMenu].name,options?.name)
                const indexMenu = res.reactionMenus.indexOf(res.reactionMenus.find(x => x._id == menuID))
                res.reactionMenus.splice(indexMenu, 1)
                res.save()
                // console.log(res.reactionMenus[indexMenu])
            }
        })
    },

    saveMenuRole: async (message, menuID, roleID, emoji, description) => {
        const guildID = message.guild.id
        await settingSchema.updateOne(
            { _id: guildID},
            {
                $push: {
                    reactionMenus:[{
                    _id: menuID,
                    reactionRoles: [{
                        role: roleID,
                        emoji: emoji,
                        description: description
                    }]}]
                }
            }).then(res => {
                console.log(res)
            });
    },
    newMenu: async (message, menuID, name) => {
        const guildID = message.guild.id
        await settingSchema.updateOne(
            { _id: guildID},
            {
                $push: {
                    reactionMenus:[{
                    _id: menuID,
                    name: name,
                    reactionRoles: []
                    }]
                }
            }).then(res => {
                console.log(res)
            });
    }
    
}