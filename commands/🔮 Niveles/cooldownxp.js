const { errorMessageEmbed, simpleEmbedDescription, simpleEmbedField } = require("../../handlers/functions")
const ee = require("../../json/embed.json")
const gm = require("../../json/globalMessages.json")
const settingsXP = require("../../models/settingsXP.model")

module.exports = {
    name: "CooldownXP",
    description: "Muestra el cooldown por mensaje, asigna un cooldown o establecelo por defecto",
    category: "🔮 Niveles",
    cooldown: 5,
    memberpermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    usage: "cooldownxp <tiempo en segundos>\ncooldownxp [default]\ncooldownxp",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const guildID = message.guild.id
            let titleEmbed = `⚠ Tiempo para experiencia por mensaje`
            let descEmbed = `El tiempo de espera se asigno en: ${args[0] ? args[0] : 60} segundo(s)`
            settingsXP.findOne({ _id: guildID }, (err, res) => {
                if (err) {
                    console.log(String(err.stack).bgRed);
                    errorMessageEmbed(err, message)
                }
                if (res) {
                    if (args[0] === 'default') {
                        res.cooldown = 60
                        res.save()
                        descEmbed = ':white_check_mark: Se han puesto en default el tiempo para conseguir experiencia por mensaje.'
                        return simpleEmbedDescription(message, ee.color, gm.shortTime, descEmbed);
                    }
                    if (!args[0]) {
                        titleEmbed = `⚠ Tiempo para experiencia por mensaje`
                        descEmbed = `El tiempo de espera esta asignado en: ${res.cooldown ? res.cooldown : 60} segundo(s)`
                        return simpleEmbedField(message, ee.color, gm.largeTime, titleEmbed, descEmbed)
                    }
                    if (isValid(args[0])) {
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, isValid(args[0]))
                    }
                    res.cooldown = args[0]
                    res.save()

                } else {
                    if (!args[0]) {
                        titleEmbed = `⚠ Tiempo para experiencia por mensaje`
                        descEmbed = `El tiempo de espera esta asignado en: 60 segundo(s)`
                        return simpleEmbedField(message, ee.color, gm.largeTime, titleEmbed, descEmbed)
                    }
                    if (isValid(args[0])) {
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, isValid(args[0]))
                    }
                    const newData = new settingsXP({
                        _id: guildID,
                        cooldown: args[0]
                    })
                    newData.save()
                }
                simpleEmbedField(message, ee.checkcolor, null, titleEmbed, descEmbed)
            })

            const isValid = (value) => {
                if (isNaN(value)) {
                    return '❌ No puedo asignar esto, coloca numeros'
                }
                if (value <= 0) {
                    return '❌ El tiempo debe ser mayor a 0'
                }
            }

        } catch (e) {
            console.log(String(e.stack).bgRed);
            errorMessageEmbed(e, message)
        }
    },
};