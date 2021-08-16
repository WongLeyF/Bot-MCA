const { errorMessageEmbed, simpleEmbedDescription, simpleEmbedField } = require("../../handlers/functions")
const ee = require("../../json/embed.json")
const gm = require("../../json/globalMessages.json")
const settingsXP = require("../../models/settingsXP.model")

module.exports = {
    name: "RangeXP",
    description: "Este comando te permite asignar el minimo y maximo de xp por mensaje, como tambien reiniciarlo a los valores por defecto y mostrar la configuracion actual.",
    category: "🔮 Niveles",
    cooldown: 5,
    memberpermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    usage: "rangexp <min> <max>\nrangexp [default]\nrangexp",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const guildID = message.guild.id
            let titleEmbed = `⚠ Rango de experiencia por mensaje`
            let descEmbed = `La experiencia minima es: ${args[0]}\nLa experiencia maxima es: ${args[1]}`
            settingsXP.findOne({ _id: guildID }, (err, res) => {
                if (err) {
                    console.log(String(err.stack).bgRed)
                    errorMessageEmbed(err, message)
                }
                if (!args[0]) {
                    titleEmbed = `⚠ Rango de experiencia por mensaje`
                    descEmbed = `La experiencia minima es: ${res ? res.min_xp ? res.min_xp : 10 : 10}\n` +
                        `La experiencia maxima es: ${res ? res.max_xp ? res.max_xp : 30 : 30}`
                    return simpleEmbedField(message, ee.color, gm.slowTime, titleEmbed, descEmbed)
                }
                if (res) {
                    if (args[0] === 'default') {
                        descEmbed = ':white_check_mark: Se han puesto en default el minimo y maximo de experiencia ganada.'
                        res.min_xp = 10
                        res.max_xp = 30
                        res.save()
                        return simpleEmbedDescription(message, ee.color, gm.shortTime, descEmbed)
                    }
                    if (isValid(args[0], args[1])) {
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, isValid(args[0], args[1]))
                    }
                    res.min_xp = args[0]
                    res.max_xp = args[1]
                    res.save()
                } else {
                    if (isValid(args[0], args[1])) {
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, isValid(args[0], args[1]))
                    }
                    const newData = new settingsXP({
                        _id: guildID,
                        min_xp: args[0],
                        max_xp: args[1]
                    })
                    newData.save()
                }
                simpleEmbedField(message, ee.color, gm.slowTime, titleEmbed, descEmbed)
            })
            const isValid = (min, max) => {
                if (isNaN(min) || isNaN(max)) {
                    return '❌ No puedo asignar esto, coloca numeros'
                }
                if (min <= 0) {
                    return '❌ La XP minima debe ser mayor a 0'
                }
                if (parseInt(min, 10) > parseInt(max, 10)) {
                    return '❌ La XP minima debe ser menor que la maxima'
                }
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errorMessageEmbed(e, message)
        }
    },
}