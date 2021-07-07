const { MessageEmbed } = require("discord.js");
const ee = require("../../json/embed.json")
const gm = require("../../json/globalMessages.json")
const settingsXP = require("../../models/settingsXp")
const mongo = require('../../handlers/mongo')
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
            await mongo().then(async mongoose => {
                try {
                    const guildID = message.guild.id
                    let channel, data = await settingsXP.findOne({ _id: guildID })
                    let titleEmbed = `⚠ No XP Channels`, descEmbed
                    switch (args[0]) {
                        case "add":
                            if (args[1]) {
                                if (args[1].includes(`@`)) {
                                    descEmbed = `Por favor escribe un canal valido`
                                    return simpleEmbedField(message, ee.wrongcolor, gm.slowTime, titleEmbed, descEmbed)
                                }
                                if (isNaN(args[1])) channel = await message.guild.channels.cache.find(c => c.id === args[1].slice(2, -1))
                                if (!isNaN(args[1])) channel = await message.guild.channels.cache.find(c => c.id === args[1])
                                if (channel == undefined) channel = message.guild.channels.cache.find(c => c.name === args[1])
                                if (args[1] == "all") {
                                    const newArray = message.guild.channels.cache.filter(r => r.type == "text").map(r => r.id)
                                    data.noChannels = newArray
                                    await data.save()

                                    descEmbed = `Se agregaron correctamente todos los canales de la lista`
                                    return simpleEmbedDescription(message, ee.checkcolor, null, titleEmbed, descEmbed)

                                }

                                if (!channel) {
                                    descEmbed = `Por favor escribe un canal valido para asignar`
                                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, descEmbed)
                                }

                                if (data) {
                                    if (!data.noChannels.includes(channel.id))
                                        data.noChannels.push(channel.id)
                                    await data.save()

                                    descEmbed = `Se agrego correctamente a la lista el canal: ${args[1]}`
                                    return simpleEmbedField(message, ee.checkcolor, null, descEmbed)

                                } else {
                                    const newData = new settingsXP({
                                        _id: guildID,
                                        noChannels: [channel.id]
                                    })
                                    await newData.save()
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
                                if (isNaN(args[1])) channel = await message.guild.channels.cache.find(c => c.id === args[1].slice(2, -1))
                                if (!isNaN(args[1])) channel = await message.guild.channels.cache.find(c => c.id === args[1])
                                if (channel == undefined) channel = message.guild.channels.cache.find(c => c.name === args[1])
                                if (args[1] == "all") {
                                    const newArray = []
                                    data.noChannels = newArray
                                    await data.save()

                                    descEmbed = `Se borro correctamente todos los canales de la lista`
                                    return simpleEmbedDescription(message, ee.checkcolor, null, titleEmbed, descEmbed)
                                }
                                if (!channel) {
                                    descEmbed = `Por favor escribe un canal valido para eliminar`
                                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
                                }
                                if (data) {
                                    if (data.noChannels.includes(channel.id)) {
                                        const newArray = removeItemFromArr(data.noChannels, channel.id)
                                        data.noChannels = newArray
                                        await data.save()

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
                            if (data) {
                                channel = await message.guild.channels.cache.map(c => c.id)
                                const nochannelsMap = data.noChannels.map(m => channel.includes(m) ? "<#" + m + ">\n\n" : "")
                                return message.channel.send(new MessageEmbed()
                                    .setTitle("**Canales que no reciben XP**:")
                                    .setDescription(`\n${nochannelsMap.length > 0 ? nochannelsMap.join(" ") : "**Ninguno**"}`)
                                )
                            }
                            break;
                        default:
                            titleEmbed = `⚠ Por favor, dime que realizar`
                            descEmbed = `Uso: \`${prefix}noXPchannel <list/add/remove> <Canal>\``
                            return simpleEmbedDescription(message, ee.wrongcolor, gm.slowTime, titleEmbed, descEmbed)
                    }
                } finally {
                    mongoose.connection.close()
                }
            })
        } catch (e) {
            console.log(String(e.stack).bgRed);
            errorMessageEmbed(e, message)
        }
    },
};