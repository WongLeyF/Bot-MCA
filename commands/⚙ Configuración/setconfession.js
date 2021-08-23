const { errorMessageEmbed, simpleEmbedDescription, simpleEmbedField } = require("../../handlers/functions")
const ee = require("../../json/embed.json");
const gm = require("../../json/globalMessages.json");
const mongo = require('../../handlers/mongo/mongo')
const settingsconfessionSchema = require('../../models/setting.model');

module.exports = {
    name: "setConfession",
    aliases: ["sc", "setsecret"],
    description: "Establece un canal para recibir confesiones\nPara deshabilitar no ingreses el canal.",
    category: "⚙ Configuración",
    cooldown: 10,
    memberpermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    usage: "setconfession [Canal/ID]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const guildID = message.guild.id
            const channelID = args[0] ? args[0].replace('<#', '').replace('>', '') : ""
            const channel = client.channels.cache.get(channelID)
            let descEmbed = '❌ Se han sido desactivado las confesiones.'
            settingsconfessionSchema.findOne({ _id: guildID }, (err, res) => {
                if (err) {
                    console.log(String(err.stack).bgRed);
                    errorMessageEmbed(err, message)
                }
                if (res) {
                    if (!args[0]) {
                        res.confessionChannel = ""
                        res.save()
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed, true)
                    }
                    if (!channel) {
                        descEmbed = '❌ No puedo reconocer este canal'
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed, true)
                    }
                    res.confessionChannel = channelID
                    res.save()
                    descEmbed = `:white_check_mark: Las confesiones se enviarán al canal: \`${channel.name}\` `
                }
                else {
                    if (!args[0]) {
                        let titleEmbed = `:warning: Por favor, especifica el canal`
                        descEmbed = `Uso: \`${prefix}setconfession [Canal/ID]\``
                        return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
                    }
                    if (!channel) {
                        descEmbed = '❌ No puedo reconocer este canal'
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed, true)
                    }
                    const newData = new settingsconfessionSchema({
                        _id: guildID,
                        confessionChannel: channelID,
                    });
                    newData.save()
                    descEmbed = `:white_check_mark: Las confesiones se enviarán al canal: \`${channel.name}\` `
                }
                simpleEmbedDescription(message, ee.color, null, descEmbed)
            });
        } catch (e) {
            console.log(String(e.stack).bgRed);
            errorMessageEmbed(e, message)
        }
    },
};