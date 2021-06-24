const { MessageEmbed, WebhookClient } = require("discord.js")
const ee = require("../../botconfig/embed.json")
const gm = require("../../botconfig/globalMessages.json")
const settingsXP = require("../../models/settingsXp")
const mongo = require('../../handlers/mongo')
const { removeItemFromArr } = require("../../handlers/functions")

module.exports = {
    name: "noXPchannel",
    description: "Agrega canales para que no reciban exp y como tambien ver la lista de canales que no reciben exp",
    category: "🔮 Niveles",
    cooldown: 5,
    memberpermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    usage: "noxpchannel <list/add/remove> <Canal>",
    run: async (client, message, args, user, text, prefix) => {
        try {
            await mongo().then(async mongoose => {
                try {
                    const guildID = message.guild.id
                    let channel, data = await settingsXP.findOne({ _id: guildID })
                    switch (args[0]) {
                        case "add":
                            if (args[1]) {
                                if (args[1].includes(`@`)) return await message.reply(new MessageEmbed()
                                    .setColor(ee.wrongcolor)
                                    .setTitle("⚠ No XP Channels")
                                    .setDescription(`Por favor escribe un canal valido`)
                                ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                                if (isNaN(args[1])) channel = await message.guild.channels.cache.find(c => c.id === args[1].slice(2, -1))
                                if (!isNaN(args[1])) channel = await message.guild.channels.cache.find(c => c.id === args[1])
                                if (channel == undefined) channel = message.guild.channels.cache.find(c => c.name === args[1])
                                if (args[1] == "all") {
                                    const newArray = message.guild.channels.cache.filter(r => r.type == "text").map(r => r.id)
                                    data.noChannels = newArray
                                    await data.save()
                                    return message.channel.send(new MessageEmbed()
                                        .setColor(ee.checkcolor)
                                        .setTitle("⚠ No XP Channels")
                                        .setDescription(`Se agregaron correctamente todos los canales de la lista`)
                                    )
                                }
                                if (!channel) return await message.reply(new MessageEmbed()
                                    .setColor(ee.wrongcolor)
                                    .setTitle("⚠ No XP Channels")
                                    .setDescription(`Por favor escribe un canal valido para asignar`)
                                ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                                if (data) {
                                    if (!data.noChannels.includes(channel.id))
                                        data.noChannels.push(channel.id)
                                    await data.save()
                                    return message.channel.send(new MessageEmbed()
                                        .setColor(ee.checkcolor)
                                        .setTitle("⚠ No XP Channels")
                                        .setDescription(`Se agrego correctamente a la lista el canal: ${args[1]}`)
                                    )
                                } else {
                                    const newData = new settingsXP({
                                        _id: guildID,
                                        noChannels: [channel.id]
                                    })
                                    await newData.save()
                                    return message.channel.send(new MessageEmbed()
                                        .setColor(ee.checkcolor)
                                        .setTitle("⚠ No XP Channels")
                                        .setDescription(`Se agrego correctamente a la lista el canal: ${args[1]}`)
                                    )
                                }
                            } else return await message.reply(new MessageEmbed()
                                .setColor(ee.color)
                                .setTitle(`⚠ Por favor, dime que realizar`)
                                .setDescription(`Uso: \`${prefix}noXPchannel <list/add/remove> <Canal>\``)
                            ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                        case "remove":
                            if (args[1]) {
                                if (isNaN(args[1])) channel = await message.guild.channels.cache.find(c => c.id === args[1].slice(2, -1))
                                if (!isNaN(args[1])) channel = await message.guild.channels.cache.find(c => c.id === args[1])
                                if (channel == undefined) channel = message.guild.channels.cache.find(c => c.name === args[1])
                                if (args[1] == "all") {
                                    const newArray = []
                                    data.noChannels = newArray
                                    await data.save()
                                    return message.channel.send(new MessageEmbed()
                                        .setColor(ee.checkcolor)
                                        .setTitle("⚠ No XP Channels")
                                        .setDescription(`Se borro correctamente todos los canales de la lista`)
                                    )
                                }
                                if (!channel) return await message.reply(new MessageEmbed()
                                    .setColor(ee.wrongcolor)
                                    .setTitle("⚠ No XP Channels")
                                    .setDescription(`Por favor escribe un canal valido para eliminar`)
                                ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                                if (data) {
                                    if (data.noChannels.includes(channel.id)) {
                                        const newArray = removeItemFromArr(data.noChannels, channel.id)
                                        data.noChannels = newArray
                                        await data.save()
                                        return message.channel.send(new MessageEmbed()
                                            .setColor(ee.checkcolor)
                                            .setTitle("⚠ No XP Channels")
                                            .setDescription(`Se borro correctamente de la lista el canal: ${args[1]}`)
                                        )
                                    } else {

                                        return message.channel.send(new MessageEmbed()
                                            .setColor(ee.wrongcolor)
                                            .setTitle("⚠ No XP Channels")
                                            .setDescription(`No encontre ningun canal que se llame asi: ${args[1]}`)
                                        )
                                    }
                                }
                            } else return await message.reply(new MessageEmbed()
                                .setColor(ee.color)
                                .setTitle(`⚠ Por favor, dime que realizar`)
                                .setDescription(`Uso: \`${prefix}noXPchannel <list/add/remove> <Canal>\``)
                            ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                        case "list":
                            if (data) {
                                channel = await message.guild.channels.cache.map(c => c.id)
                                const nochannelsMap = data.noChannels.map(m => channel.includes(m) ? "<#" + m + ">\n\n" : "")
                                return message.channel.send(new MessageEmbed()
                                    .setTitle("**Canales que no reciben XP**:")
                                    .setDescription(`\n${nochannelsMap.length > 0 ? nochannelsMap.join(" ") : "**Ninguno**"}`)
                                )
                            }
                            break;
                        default:
                            return await message.reply(new MessageEmbed()
                                .setColor(ee.color)
                                .setTitle(`⚠ Por favor, dime que realizar`)
                                .setDescription(`Uso: \`${prefix}noXPchannel <list/add/remove> <Canal>\``)
                            ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                    }
                } finally {
                    mongoose.connection.close()
                }
            })
        } catch (e) {
            console.log(String(e.stack).bgRed);
            const webhookClient = new WebhookClient(process.env.webhookID, process.env.webhookToken);
            const embed = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(gm.titleError)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
            await webhookClient.send('Webhook Error', {
                username: message.guild.name,
                avatarURL: message.guild.iconURL({ dynamic: true }),
                embeds: [embed],
            });
        }
    },
};