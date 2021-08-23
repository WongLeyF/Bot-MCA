const { errorMessageEmbed, simpleEmbedField } = require("../../handlers/functions")
const ee = require("../../json/embed.json")
const gm = require("../../json/globalMessages.json")
const settings = require("../../models/setting.model")
const mongo = require('../../handlers/mongo/mongo')

module.exports = {
    name: "Levels",
    description: "Muestra el cooldown por mensaje, asigna un cooldown o establecelo por defecto",
    category: "🔮 Niveles",
    cooldown: 5,
    memberpermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    usage: "levels <on/off>",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const guildID = message.guild.id
            let status, titleEmbed, descEmbed
            switch (args[0]) {
                case "enable":
                    status = true
                    break;
                case "on":
                    status = true
                    break;
                case "disable":
                    status = false
                    break;
                case "d":
                    status = false
                    break;
                case "off":
                    status = false
                    break;
                default:
                    status = true
                    break;
            }

            settings.findOne({ _id: guildID }, (err, res) => {
                if (err) {
                    console.log(String(err.stack).bgRed);
                    errorMessageEmbed(err, message)
                }
                if (!args[0]) {
                    titleEmbed = `⚠ Sistema de niveles`
                    descEmbed = `El sistema de niveles esta: ${res ? res.levelSystem ? "Activado" : "Desactivado" : "Activado"}`
                    return simpleEmbedField(message, ee.color, gm.slowTime, titleEmbed, descEmbed)
                }
                if (res) {
                    res.levelSystem = status
                    res.save()
                } else {
                    const newres = new settings({
                        _id: guildID,
                        levelSystem: status
                    })
                    newres.save()
                }
                titleEmbed = `⚠ Sistema de niveles`
                descEmbed = `El sistema de niveles esta: ${status ? "Activado" : "Desactivado"} `
                simpleEmbedField(message, ee.checkcolor, null, titleEmbed, descEmbed)
            })
        } catch (e) {
            console.log(String(e.stack).bgRed);
            errorMessageEmbed(e, message)
        }
    },
};