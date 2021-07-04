const { MessageEmbed } = require("discord.js");
const { errorMessageEmbed } = require("../../handlers/functions")
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
const mongo = require('../../handlers/mongo')
const settingslevelSchema = require('../../models/setting_schema')

module.exports = {
    name: "setLVLChannel",
    aliases: ["slvlch", "setlvlch"],
    description: "Establece un canal para recibir confesiones\nPara deshabilitar no ingreses el canal.",
    category: "⚙ Configuración",
    cooldown: 10,
    memberpermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    usage: "setlvlchannel [Canal]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            await mongo().then(async mongoose => {
                try {
                    const guildID = message.guild.id
                    const channelID = args[0] ? args[0].replace('<#', '').replace('>', '') : ""
                    const channel = client.channels.cache.get(channelID)
                    let data = await settingslevelSchema.findOne({ _id: guildID });
                    if (!args[0]) {
                        if (data) {
                            data.levelChannel = ""
                            await data.save()
                        }
                        return message.reply(new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription('❌ Se ha desactivado el canal de niveles.')
                        ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                    }
                    if (!channel) return message.reply(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription('❌ No puedo reconocer este canal')
                    ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                    if (data) {
                        data.levelChannel = channelID
                        await data.save()
                    } else {
                        let newData = new settingslevelSchema({
                            _id: guildID,
                            levelChannel: channelID,
                        });
                        await newData.save()
                    }
                    message.channel.send(new MessageEmbed()
                        .setColor(ee.color)
                        .setDescription(`:white_check_mark: Las mensajes de niveles se enviarán al canal: \`${channel.name}\` `)
                    );
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