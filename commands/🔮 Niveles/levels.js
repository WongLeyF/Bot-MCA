const { MessageEmbed } = require("discord.js");
const { errorMessageEmbed, simpleEmbedField } = require("../../handlers/functions")
const ee = require("../../json/embed.json")
const gm = require("../../json/globalMessages.json")
const settings = require("../../models/setting_schema")
const mongo = require('../../handlers/mongo')

module.exports = {
    name: "Levels",
    description: "Muestra el cooldown por mensaje, asigna un cooldown o establecelo por defecto",
    category: "🔮 Niveles",
    cooldown: 5,
    memberpermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    usage: "levels <enable/disable>",
    run: async (client, message, args, user, text, prefix) => {
        try {
            await mongo().then(async mongoose => {
                try {
                    const guildID = message.guild.id
                    let data = await settings.findOne({ _id: guildID })
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

                    if (!args[0]) {
                        titleEmbed = `⚠ Sistema de niveles`
                        descEmbed = `El sistema de niveles esta: ${data ? data.levelSystem ? "Activado" : "Desactivado" : "Activado"}`
                        return simpleEmbedField(message, ee.color, gm.slowTime, titleEmbed, descEmbed)
                    }
                    
                    if (data) {
                        data.levelSystem = status
                        await data.save()
                    } else {
                        const newData = new settings({
                            _id: guildID,
                            levelSystem: status
                        })
                        await newData.save()
                    }

                    titleEmbed = `⚠ Sistema de niveles`
                    descEmbed = `El sistema de niveles esta: ${status ? "Activado" : "Desactivado"} `
                    simpleEmbedField(message, ee.checkcolor, null, titleEmbed, descEmbed)
                
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