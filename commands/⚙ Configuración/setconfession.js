const { errorMessageEmbed, simpleEmbedDescription } = require("../../handlers/functions")
const ee = require("../../json/embed.json");
const gm = require("../../json/globalMessages.json");
const mongo = require('../../handlers/mongo/mongo')
const settingsconfessionSchema = require('../../models/setting.model');
const { Permissions } = require("discord.js");

module.exports = {
    name: "setConfession",
    aliases: ["sc", "setsecret"],
    description: "Establece un canal para recibir confesiones\nPara deshabilitar no ingreses el canal.",
    category: "⚙ Configuración",
    cooldown: 10,
    memberpermissions: [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.MANAGE_GUILD],
    usage: "setconfession [Canal/ID]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            await mongo().then(async mongoose => {
                try {
                    const guildID = message.guild.id
                    const channelID = args[0] ? args[0].replace('<#', '').replace('>', '') : ""
                    const channel = client.channels.cache.get(channelID)
                    let data = await settingsconfessionSchema.findOne({ _id: guildID });
                    let descEmbed = '❌ Se han sido desactivado las confesiones.'

                    if (!args[0]) {
                        if (data) {
                            data.confessionChannel = ""
                            await data.save()
                        }
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed, true)
                    }
                    if (!channel) {
                        descEmbed='❌ No puedo reconocer este canal'
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed, true)
                    }
                    if (data) {
                        data.confessionChannel = channelID
                        await data.save()
                    } else {
                        const newData = new settingsconfessionSchema({
                            _id: guildID,
                            confessionChannel: channelID,
                        });
                        await newData.save()
                    }

                    descEmbed = `:white_check_mark: Las confesiones se enviarán al canal: \`${channel.name}\` `
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