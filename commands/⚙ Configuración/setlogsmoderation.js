const { errorMessageEmbed, simpleEmbedDescription } = require("../../handlers/functions")
const ee = require("../../json/embed.json");
const gm = require("../../json/globalMessages.json");
const mongo = require('../../handlers/mongo/mongo')
const settingslevelSchema = require('../../models/setting_schema')

module.exports = {
    name: "setLogsModeration",
    description: "Establece un canal para recibir los logs de ban, kick, warns y mutes\nPara deshabilitar no ingreses el canal.",
    aliases: ["slogmod", "setlogmod"],
    category: "⚙ Configuración",
    cooldown: 10,
    memberpermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    usage: "setlogsmoderation [Canal]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            await mongo().then(async mongoose => {
                try {
                    const guildID = message.guild.id
                    const channelID = args[0] ? args[0].replace('<#', '').replace('>', '') : ""
                    const channel = client.channels.cache.get(channelID)
                    let data = await settingslevelSchema.findOne({ _id: guildID });
                    let descEmbed = '❌ Se ha desactivado el canal de logs para moderacion.'

                    if (!args[0]) {
                        if (data) {
                            data.logsModeration = ""
                            await data.save()
                        }
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                    }
                    if (!channel) {
                        descEmbed = '❌ No puedo reconocer este canal'
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                    }
                    if (data) {
                        data.logsModeration = channelID
                        await data.save()
                    } else {
                        const newData = new settingslevelSchema({
                            _id: guildID,
                            logsModeration: channelID,
                        });
                        await newData.save()
                    }
                    descEmbed = `:white_check_mark: Las mensajes de moderacion se enviarán al canal: \`${channel.name}\` `
                    simpleEmbedDescription(message, ee.color, null, descEmbed)
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