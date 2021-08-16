const { errorMessageEmbed, simpleEmbedDescription, simpleEmbedField } = require("../../handlers/functions")
const ee = require("../../json/embed.json");
const gm = require("../../json/globalMessages.json");
const settingsMessCountSchema = require('../../models/setting.model');


module.exports = {
    name: "setMessageCounter",
    aliases: ["setmc", "smc"],
    description: "Establece si el bot contara los mensajes de cada usuario o no (default: on)",
    category: "⚙ Configuración",
    cooldown: 5,
    memberpermissions: ["MANAGE_GUILD"],
    usage: "setmessagecounter [on/off]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            let status = true
            let descEmbed = ''
            const guildID = message.guild.id
            settingsMessCountSchema.findOne({ _id: guildID }, (err, res) => {
                if (err) {
                    console.log(String(err.stack).bgRed);
                    errorMessageEmbed(err, message)
                }
                if (res) {
                    if (!args[0]) {
                        res.messageCounter = !res.messageCounter
                        status = res.messageCounter
                        res.save()
                    } else {
                        res.messageCounter = args[0].toLowerCase() == 'on' ? true : args[0].toLowerCase() == 'off' ? false : null;
                        if (res.messageCounter === null) {
                            let titleEmbed = `:warning: Por favor, especifica que desea hacer`
                            descEmbed = `Uso: \`${prefix}setmessagecounter [on/off]\``
                            return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
                        }
                        status = res.messageCounter
                        res.save()
                    }
                    descEmbed = `:white_check_mark: El cambio se realizo correctamente, estado: ${status == true ? "on" : "off"}`
                } else {
                    if (!args[0]) {
                        let titleEmbed = `:warning: Por favor, especifica que desea hacer`
                        descEmbed = `Uso: \`${prefix}setmessagecounter [on/off]\``
                        return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
                    } else {
                        const newData = new settingsMessCountSchema({
                            _id: guildID,
                            messageCounter: args[0].toLowerCase() == 'on' ? true : args[0].toLowerCase() == 'off' ? false : null,
                        });
                        if (newData.messageCounter === null) {
                            let titleEmbed = `:warning: Por favor, especifica que desea hacer`
                            descEmbed = `Uso: \`${prefix}setmessagecounter [on/off]\``
                            return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
                        }
                        status = newData.messageCounter
                        newData.save()
                        descEmbed = `:white_check_mark: El cambio se realizo correctamente, estado: ${status == true ? "on" : "off"}`
                    }
                }
                simpleEmbedDescription(message, ee.color, gm.shortTime, descEmbed)
            })
        } catch (e) {
            console.log(String(e.stack).bgRed);
            errorMessageEmbed(e, message)
        }
    },
};