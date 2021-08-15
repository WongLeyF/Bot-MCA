const { errorMessageEmbed, simpleEmbedDescription, simpleEmbedField } = require("../../handlers/functions")
const ee = require("../../json/embed.json")
const gm = require("../../json/globalMessages.json")
const settingsXP = require("../../models/settingsXP.model")
const mongo = require('../../handlers/mongo/mongo')
const { Permissions } = require("discord.js")

module.exports = {
    name: "RangeXP",
    description: "Este comando te permite asignar el minimo y maximo de xp por mensaje, como tambien reiniciarlo a los valores por defecto y mostrar la configuracion actual.",
    category: "🔮 Niveles",
    cooldown: 5,
    memberpermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    usage: "rangexp <min> <max>\nrangexp [default]\nrangexp",
    run: async (client, message, args, user, text, prefix) => {
        try {
            await mongo().then(async mongoose => {
                try {
                    const guildID = message.guild.id
                    let data = await settingsXP.findOne({ _id: guildID })
                    let titleEmbed, descEmbed
                    if (args[0] == 'default') {
                        if (data) {
                            data.min_xp = 10
                            data.max_xp = 30
                            await data.save()
                        }

                        descEmbed = ':white_check_mark: Se han puesto en default el minimo y maximo de experiencia ganada.'
                        return simpleEmbedDescription(message, ee.color, gm.shortTime, descEmbed)
                    }
                    if (!args[0]){
                        titleEmbed = `⚠ Rango de experiencia por mensaje`
                        descEmbed = `La experiencia minima es: ${data ? data.min_xp ? data.min_xp : 1 : 1}\n`+
                                    `La experiencia maxima es: ${data ? data.max_xp ? data.max_xp : 30 : 30}`
                        return simpleEmbedField(message, ee.color, gm.slowTime, titleEmbed, descEmbed)
                    }
                    if (isNaN(args[0]) || isNaN(args[1])) {
                        descEmbed = '❌ No puedo asignar esto, coloca numeros'
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                    }
                    if (args[0] <= 0) {
                        descEmbed = '❌ La XP minima debe ser mayor a 0'
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                    }
                    if (parseInt(args[0], 10) > parseInt(args[1], 10)) {
                        descEmbed = '❌ La XP minima debe ser menor que la maxima'
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                    } 
                    if (data) {
                        data.min_xp = args[0]
                        data.max_xp = args[1]
                        await data.save()
                    } else {
                        const newData = new settingsXP({
                            _id: guildID,
                            min_xp: args[0],
                            max_xp: args[1]
                        })
                        await newData.save()
                    }
                    titleEmbed = `⚠ Rango de experiencia por mensaje`
                    descEmbed = `La experiencia minima es: ${args[0]}\nLa experiencia maxima es: ${args[1]}`
                    simpleEmbedField(message, ee.checkcolor, null, titleEmbed, descEmbed)
                } finally {
                    mongoose.connection.close()
                }
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errorMessageEmbed(e, message)
        }
    },
}