const { MessageEmbed } = require("discord.js");
const ee = require("../../json/embed.json")
const gm = require("../../json/globalMessages.json")
const settingsXP = require("../../models/settingsXP.model")
const { removeItemFromArr, errorMessageEmbed, simpleEmbedDescription, simpleEmbedField } = require("../../handlers/functions")

module.exports = {
    name: "noXPchannel",
    description: "Agrega canales para que no reciban exp y como tambien ver la lista de canales que no reciben exp",
    category: "🔮 Niveles",
    cooldown: 5,
    memberpermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    usage: "noxpchannel <list/add/remove> <Canal>",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const guildID = message.guild.id
            let titleEmbed = `⚠ No XP Channels`
            let descEmbed
            settingsXP.findOne({ _id: guildID }, (err, res) => {
                if (err) {
                    console.log(String(err.stack).bgRed);
                    errorMessageEmbed(err, message)
                }

                switch (args[0]) {
                    case "add":
                        if (args[1]) {
                            if (args[1] === "all") {
                                res.noChannels = message.guild.channels.cache.filter(r => r.type == "GUILD_TEXT").map(r => r.id)
                                res.save()
                                descEmbed = `Se agregaron correctamente todos los canales disponibles`
                                return simpleEmbedField(message, ee.checkcolor, null, titleEmbed, descEmbed)
                            }
                            if (args[1].includes(`@`)) {
                                descEmbed = `Por favor escribe un canal valido`
                                return simpleEmbedField(message, ee.wrongcolor, gm.slowTime, titleEmbed, descEmbed)
                            }
                            const channel = getChannel(args[1])
                            if (!channel) {
                                descEmbed = `Por favor escribe un canal valido para asignar`
                                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, descEmbed)
                            }
                            if (res) {
                                if (!res.noChannels.includes(channel.id))
                                    res.noChannels.push(channel.id)
                                res.save()
                                descEmbed = `Se agrego correctamente a la lista el canal: ${args[1]}`
                                return simpleEmbedDescription(message, ee.checkcolor, null, descEmbed)
                            } else {
                                const newres = new settingsXP({
                                    _id: guildID,
                                    noChannels: [channel.id]
                                })
                                newres.save()
                                descEmbed = `Se agrego correctamente a la lista el canal: ${args[1]}`
                                return simpleEmbedField(message, ee.checkcolor, null, titleEmbed, descEmbed)

                            }
                        } else {
                            titleEmbed = `⚠ Por favor, dime que realizar`
                            descEmbed = `Uso: \`${prefix}noXPchannel <list/add/remove> <Canal>\``
                            return simpleEmbedField(message, ee.color, gm.longTime, titleEmbed, descEmbed)
                        }
                    case "remove":
                        if (args[1]) {
                            const channel = getChannel(args[1])
                            if (args[1] == "all") {
                                res.noChannels = []
                                res.save()

                                descEmbed = `Se borro correctamente todos los canales de la lista`
                                return simpleEmbedDescription(message, ee.checkcolor, null, titleEmbed, descEmbed)
                            }
                            if (!channel) {
                                descEmbed = `Por favor escribe un canal valido para eliminar`
                                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
                            }
                            if (res) {
                                if (res.noChannels.includes(channel.id)) {
                                    res.noChannels = removeItemFromArr(res.noChannels, channel.id)
                                    res.save()
                                    descEmbed = `Se borro correctamente de la lista el canal: ${args[1]}`
                                    return simpleEmbedDescription(message, ee.checkcolor, null, titleEmbed, descEmbed)
                                } else {
                                    descEmbed = `No encontre ningun canal que se llame asi: ${args[1]}`
                                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
                                }
                            }
                        } else {
                            titleEmbed = `⚠ Por favor, dime que realizar`
                            descEmbed = `Uso: \`${prefix}noXPchannel <list/add/remove> <Canal>\``
                            return simpleEmbedDescription(message, ee.wrongcolor, gm.slowTime, titleEmbed, descEmbed)
                        }
                    case "list":
                        if (res) {
                            channel = message.guild.channels.cache.map(c => c.id)
                            const nochannelsMap = res.noChannels.map(m => channel.includes(m) ? "<#" + m + ">\n\n" : "")
                            return message.channel.send({
                                embeds: [new MessageEmbed()
                                    .setTitle("**Canales que no reciben XP**:")
                                    .setDescription(`\n${nochannelsMap.length > 0 ? nochannelsMap.join(" ") : "**Ninguno**"}`)
                                ]
                            })
                        }
                        break;
                    default:
                        titleEmbed = `⚠ Por favor, dime que realizar`
                        descEmbed = `Uso: \`${prefix}noXPchannel <list/add/remove> <Canal>\``
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.slowTime, titleEmbed, descEmbed)
                }
            })
            const getChannel = (value) => {
                let channel
                if (isNaN(value)) channel = message.guild.channels.cache.find(c => c.id === args[1].slice(2, -1))
                if (!isNaN(value)) channel = message.guild.channels.cache.find(c => c.id === args[1])
                if (channel == undefined) channel = message.guild.channels.cache.find(c => c.name === args[1])
                return channel
            }
        } catch (e) {
            console.log(String(e.stack).bgRed);
            errorMessageEmbed(e, message)
        }
    },
};