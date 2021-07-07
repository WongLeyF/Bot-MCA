const { MessageEmbed } = require("discord.js");
const { errorMessageEmbed, simpleEmbedField, simpleEmbedDescription } = require("../../handlers/functions")
const ee = require("../../json/embed.json")
const gm = require("../../json/globalMessages.json")
const userSettings = require("../../models/usersettings")
const mongo = require('../../handlers/mongo')

module.exports = {
    name: "RankSetting",
    description: "Este comando te permite cambiar ciertos aspectos a la tarjeta del rango.\nPara mas info coloca solo ranksettings <img|bar|status|color>",
    category: "🔮 Niveles",
    cooldown: 5,
    usage: "ranksetting <img|bar|status|color> [URL|HEX|STATUS]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            await mongo().then(async mongoose => {
                const guildID = message.guild.id
                const member = message.author;
                let data = await userSettings.findOne({ guildId: guildID, userId: member.id })
                let titleEmbed, descEmbed
                try {
                    switch (args[0]) {
                        case "img":
                            if (!args[1]) {
                                titleEmbed = `⚠ Info IMG`
                                descEmbed = `Coloca el link de la imagen que deseas, debe terminar en formato de imagen (png, jpg, jpeg, etc.)\n` +
                                            ` Ejemplo del comando \`${prefix}ranksetting img https://i.imgur.com/B7oECZe.jpeg\``;
                                return simpleEmbedField(message, ee.color, gm.slowTime, titleEmbed, descEmbed)
                            }
                            if (data) {
                                data.imgRank = args[1]
                                await data.save()
                            } else {
                                const newData = new userSettings({
                                    userId: member.id,
                                    guildId: guildID,
                                    imgRank: args[1],
                                    colorBackground: "#000"
                                })
                                await newData.save()
                            }
                            break;
                        case "bar":
                            if (!args[1]) {
                                titleEmbed = `⚠ Info BAR` 
                                descEmbed = `Coloca el color que deseas en HEX, debe tener minimo las tres primeros caracteres "#ABC"\n`+
                                            `Ejemplo del comando \`${prefix}ranksetting bar "#ABC"\``;
                                return simpleEmbedField(message, ee.color, gm.slowTime, titleEmbed, descEmbed)
                            }
                            if (!/^#([0-9A-F]{3}){1,2}$/i.test(args[1])) {
                                titleEmbed = `⚠ Color invalido`
                                descEmbed = `Coloca un color tipo HEX`
                                return simpleEmbedField(message, ee.wrongcolor, gm.shortTime, titleEmbed, descEmbed)
                            }
                            if (data) {
                                data.colorBar = args[1]
                                await data.save()
                            } else {
                                const newData = new userSettings({
                                    userId: member.id,
                                    guildId: guildID,
                                    colorBar: args[1]
                                })
                                await newData.save()
                            }
                            break;
                        case "status":
                            // , default: 'online', enum: ['idle', 'dnd', 'offline', 'streaming']
                            if (!args[1]) {
                                titleEmbed = `⚠ Info STATUS` 
                                descEmbed = `Coloca el estado de discord, solo se se pueden asignar: online, idle, dnd, offline y streaming \n`+
                                            ` Ejemplo del comando \`${prefix}ranksetting status online\``
                                return simpleEmbedField(message, ee.color, gm.slowTime, titleEmbed, descEmbed)
                            }
                            let status = "online"
                            switch (args[1]) {
                                case "idle":
                                    status = args[1]
                                    break;
                                case "dnd":
                                    status = args[1]
                                    break;
                                case "offline":
                                    status = args[1]
                                    break;
                                case "streaming":
                                    status = args[1]
                                    break;

                                default:
                                    status = "online"
                                    break;
                            }
                            if (data) {
                                data.colorStatus = status
                                await data.save()
                            } else {
                                const newData = new userSettings({
                                    userId: member.id,
                                    guildId: guildID,
                                    colorStatus: status
                                })
                                await newData.save()
                            }
                            break;
                        case "color":
                            if (!args[1]) {
                                titleEmbed = `⚠ Info COLOR` 
                                descEmbed = `Coloca el color que deseas en HEX, debe tener minimo las tres primeros caracteres "#ABC"\n`+
                                            ` Ejemplo del comando \`${prefix}ranksetting color "#ABC"\``
                                return simpleEmbedField(message, ee.color, gm.slowTime, titleEmbed, descEmbed)
                            }
                            if (!/^#([0-9A-F]{3}){1,2}$/i.test(args[1])) {
                                titleEmbed = `⚠ Color invalido`
                                descEmbed = `Coloca un color tipo HEX`
                                return simpleEmbedField(message, ee.wrongcolor, gm.shortTime, titleEmbed, descEmbed)
                            } 
                            if (data) {
                                data.colorBackground = args[1]
                                data.imgRank = null
                                await data.save()
                            } else {
                                const newData = new userSettings({
                                    userId: member.id,
                                    guildId: guildID,
                                    colorBackground: args[1]
                                })
                                await newData.save()
                            }
                            break;

                        default:
                            titleEmbed = `⚠ Por favor, dime que realizar hacer, ${args[0] == undefined ? "" : `\`${args[0]}\``} no lo reconozco como accion`
                            descEmbed = `Uso: \`${prefix}ranksetting <img|bar|status|color> [URL|HEX|STATUS]\``
                            return simpleEmbedField(message, ee.wrongcolor, null, titleEmbed, descEmbed)
                    }

                    descEmbed = `Tus cambios han sido guardados`
                    simpleEmbedDescription(message, ee.checkcolor, null, descEmbed)

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