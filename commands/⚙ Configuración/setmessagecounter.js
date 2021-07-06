const { MessageEmbed } = require("discord.js");
const { errorMessageEmbed, simpleEmbedDescription } = require("../../handlers/functions")
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
const mongo = require('../../handlers/mongo');
const settingsMessCountSchema = require('../../models/setting_schema');

module.exports = {
    name: "setmessagecounter",
    aliases: ["setmc", "smc"],
    description: "Establece si el bot contara los mensajes de cada usuario o no (default: on)",
    category: "⚙ Configuración",
    cooldown: 10,
    memberpermissions: ["MANAGE_GUILD"],
    usage: "setmessagecounter [on/off]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            let status = true
            await mongo().then(async mongoose => {
                try {
                    const guildID = message.guild.id
                    let data = await settingsMessCountSchema.findOne({ _id: guildID })
                    let descEmbed
                    if (!args[0]) {
                        if (data) {
                            status = !data.messageCounter
                            await data.save()
                        } else {
                            let newData = new settingsMessCountSchema({
                                _id: guildID,
                                messageCounter: false,
                            });
                            status = newData.messageCounter
                            await newData.save()
                        }
                    } else {
                        if (data) {
                            data.messageCounter = args[0].toLowerCase() == 'on' ? true : args[0].toLowerCase() == 'off' ? false : null;
                            if (!data.messageCounter) {
                                descEmbed = '❌ Dame un argumento valido (on/off) '
                                return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                            }
                            status = data.messageCounter
                            await data.save()
                        } else {
                            const newData = new settingsMessCountSchema({
                                _id: guildID,
                                messageCounter: args[0].toLowerCase() == 'on' ? true : args[0].toLowerCase() == 'off' ? false : null,
                            });
                            if (!newData.messageCounter){
                                descEmbed = '❌ Dame un argumento valido (on/off) '
                                return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                            }
                            status = newData.messageCounter
                            await newData.save()
                        }
                    }
                } finally {
                    mongoose.connection.close()
                }
            })
            descEmbed = `:white_check_mark: El cambio se realizo correctamente, estado: ${status == true ? "on" : "off"}`
            simpleEmbedDescription(message, ee.color, gm.shortTime, descEmbed)
        } catch (e) {
            console.log(String(e.stack).bgRed);
            errorMessageEmbed(e, message)
        }
    },
};