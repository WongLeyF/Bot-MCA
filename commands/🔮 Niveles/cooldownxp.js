const { errorMessageEmbed, simpleEmbedDescription, simpleEmbedField } = require("../../handlers/functions")
const ee = require("../../json/embed.json")
const gm = require("../../json/globalMessages.json")
const settingsXP = require("../../models/settingsXP.model")
const mongo = require('../../handlers/mongo/mongo')
const { Permissions } = require("discord.js")

module.exports = {
    name: "CooldownXP",
    description: "Muestra el cooldown por mensaje, asigna un cooldown o establecelo por defecto",
    category: "🔮 Niveles",
    cooldown: 5,
    memberpermissions: [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.MANAGE_GUILD],
    usage: "cooldownxp <tiempo en segundos>\ncooldownxp [default]\ncooldownxp",
    run: async (client, message, args, user, text, prefix) => {
        try {
            await mongo().then(async mongoose => {
                try {
                    const guildID = message.guild.id
                    let data = await settingsXP.findOne({ _id: guildID })
                    let titleEmbed, descEmbed
                    
                    if (args[0] == 'default') {
                        if (data) {
                            data.cooldown = 60
                            await data.save()
                        }
                        descEmbed = ':white_check_mark: Se han puesto en default el tiempo para conseguir experiencia por mensaje.'
                        return simpleEmbedDescription(message, ee.color, gm.shortTime, descEmbed);
                    }
                    
                    if (!args[0]) {
                        titleEmbed =`⚠ Tiempo para experiencia por mensaje`
                        descEmbed = `El tiempo de espera esta asignado en: ${data ? data.cooldown : 60} segundo(s)`
                        return simpleEmbedField(message, ee.color, gm.largeTime, titleEmbed, descEmbed)
                    }
                    
                    if (isNaN(args[0])) {
                        descEmbed = '❌ No puedo asignar esto, coloca numeros'
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                    } 
                    
                    if (args[0] <= 0){
                        descEmbed = '❌ El tiempo debe ser mayor a 0'
                        simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                    }
                    
                    if (data) {
                        data.cooldown = args[0]
                        await data.save()
                    } else {
                        const newData = new settingsXP({
                            _id: guildID,
                            cooldown: args[0]
                        })
                        await newData.save()
                    }
                    
                    titleEmbed = `⚠ Tiempo para experiencia por mensaje`
                    descEmbed = `El tiempo de espera se asigno en: ${args[0]} segundo(s)`
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