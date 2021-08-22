const { errorMessageEmbed, simpleEmbedField, simpleEmbedDescription } = require("../../handlers/functions")
const ee = require("../../json/embed.json")
const gm = require("../../json/globalMessages.json")
const userSettings = require("../../models/userSettings.model")
const mongo = require('../../handlers/mongo/mongo')

module.exports = {
    name: "RankSetting",
    description: "Este comando te permite cambiar ciertos aspectos a la tarjeta del rango.\nPara mas info coloca solo ranksettings <img|bar|color>",
    category: "🔮 Niveles",
    cooldown: 5,
    usage: "ranksetting <img|bar|color> [URL|HEX]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const guildID = message.guild.id
            const member = message.author;
            let titleEmbed, descEmbed
            userSettings.findOne({ guildId: guildID, userId: member.id }, (err, res) => {
                if (err) {
                    console.log(String(err.stack).bgRed)
                    errorMessageEmbed(err, message)
                }
                switch (args[0]) {
                    case "img":
                        if (!args[1]) {
                            titleEmbed = `⚠ Info IMG`
                            descEmbed = `Coloca el link de la imagen que deseas, debe terminar en formato de imagen (png, jpg, jpeg, etc.)\n` +
                                ` Ejemplo del comando \`${prefix}ranksetting img https://i.imgur.com/B7oECZe.jpeg\``;
                            return simpleEmbedField(message, ee.color, gm.slowTime, titleEmbed, descEmbed, true)
                        }
                        if (res) {
                            res.imgRank = args[1]
                            res.save()
                        } else {
                            const newData = new userSettings({
                                userId: member.id,
                                guildId: guildID,
                                imgRank: args[1],
                                colorBackground: "#000"
                            })
                            newData.save()
                        }
                        break;
                    case "bar":
                        if (!args[1]) {
                            titleEmbed = `⚠ Info BAR`
                            descEmbed = `Coloca el color que deseas en HEX, debe tener minimo las tres primeros caracteres "#ABC"\n` +
                                `Ejemplo del comando \`${prefix}ranksetting bar "#ABC"\``;
                            return simpleEmbedField(message, ee.color, gm.slowTime, titleEmbed, descEmbed, true)
                        }
                        if (!/^#([0-9A-F]{3}){1,2}$/i.test(args[1])) {
                            titleEmbed = `⚠ Color invalido`
                            descEmbed = `Coloca un color tipo HEX`
                            return simpleEmbedField(message, ee.wrongcolor, gm.shortTime, titleEmbed, descEmbed, true)
                        }
                        if (res) {
                            res.colorBar = args[1]
                            res.save()
                        } else {
                            const newData = new userSettings({
                                userId: member.id,
                                guildId: guildID,
                                colorBar: args[1]
                            })
                            newData.save()
                        }
                        break;
                    case "color":
                        if (!args[1]) {
                            titleEmbed = `⚠ Info COLOR`
                            descEmbed = `Coloca el color que deseas en HEX, debe tener minimo las tres primeros caracteres "#ABC"\n` +
                                ` Ejemplo del comando \`${prefix}ranksetting color "#ABC"\``
                            return simpleEmbedField(message, ee.color, gm.slowTime, titleEmbed, descEmbed, true)
                        }
                        if (!/^#([0-9A-F]{3}){1,2}$/i.test(args[1])) {
                            titleEmbed = `⚠ Color invalido`
                            descEmbed = `Coloca un color tipo HEX`
                            return simpleEmbedField(message, ee.wrongcolor, gm.shortTime, titleEmbed, descEmbed, true)
                        }
                        if (res) {
                            res.colorBackground = args[1]
                            if (res.imgRank) delete res.imgRank
                            res.save()
                        } else {
                            const newData = new userSettings({
                                userId: member.id,
                                guildId: guildID,
                                colorBackground: args[1]
                            })
                            newData.save()
                        }
                        break;

                    default:
                        titleEmbed = `⚠ Por favor, dime que realizar hacer, ${args[0] == undefined ? "" : `\`${args[0]}\``} no lo reconozco como accion`
                        descEmbed = `Uso: \`${prefix}ranksetting ranksetting <img|bar|color> [URL|HEX]\``
                        return simpleEmbedField(message, ee.wrongcolor, null, titleEmbed, descEmbed, true)
                }

                descEmbed = `Tus cambios han sido guardados`
                simpleEmbedDescription(message, ee.checkcolor, null, descEmbed, true)
            })

        } catch (e) {
            console.log(String(e.stack).bgRed)
            errorMessageEmbed(e, message)
        }
    },
}