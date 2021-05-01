const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
const mongo = require('../../handlers/mongo');
const settingsMessCountSchema = require('../../schemas/setting_schema');

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
                    let data = await settingsMessCountSchema.findOne({ _id: guildID });
                    if (!args[0]) {
                        if (data) {
                            data.messageCounter = !data.messageCounter
                            status = data.messageCounter
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
                            if (!data.messageCounter) return message.reply(new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setDescription('❌ Dame un argumento valido (on/off) ')
                            ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                            status = data.messageCounter
                            await data.save()
                        } else {
                            let newData = new settingsMessCountSchema({
                                _id: guildID,
                                messageCounter: args[0].toLowerCase() == 'on' ? true : args[0].toLowerCase() == 'off' ? false : null,
                            });
                            if (!newData.messageCounter) return message.reply(new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setDescription('❌ Dame un argumento valido (on/off) ')
                            ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                            status = newData.messageCounter
                            await newData.save()
                        }
                    }
                } finally {
                    mongoose.connection.close()
                }
            })
            message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setDescription(`:white_check_mark: El cambio se realizo correctamente, estado: ${status == true ? "on" : "off"}`)
            ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
        } catch (e) {
            console.log(String(e.stack).bgRed);
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(gm.titleError)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
            );
        }
    },
};