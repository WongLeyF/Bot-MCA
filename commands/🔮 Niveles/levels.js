const { MessageEmbed } = require("discord.js");
const { errorMessageEmbed } = require("../../handlers/functions")
const ee = require("../../botconfig/embed.json")
const gm = require("../../botconfig/globalMessages.json")
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
                    let status
                    switch (args[0]) {
                        case "enable":
                            status = true
                            break;
                        case "disable":
                            status = false
                            break;
                        case "d":
                            status = false
                            break;
                        default:
                            status = true
                            break;
                    }

                    if (!args[0]) return await message.reply(new MessageEmbed()
                        .setColor(ee.color)
                        .setTitle("⚠ Sistema de niveles")
                        .setDescription(`El sistema de niveles esta: ${data ? data.levelSystem ? "Activado" : "Desactivado" : "Activado"}`)
                    ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
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
                    message.channel.send(new MessageEmbed()
                        .setColor(ee.checkcolor)
                        .setTitle("⚠ Sistema de niveles")
                        .setDescription(`El sistema de niveles esta: ${status ? "Activado" : "Desactivado"} `)
                    )
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