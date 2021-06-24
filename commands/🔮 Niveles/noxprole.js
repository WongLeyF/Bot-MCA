const { MessageEmbed, WebhookClient } = require("discord.js")
const ee = require("../../botconfig/embed.json")
const gm = require("../../botconfig/globalMessages.json")
const settingsXP = require("../../models/settingsXp")
const mongo = require('../../handlers/mongo')
const { removeItemFromArr } = require("../../handlers/functions")

module.exports = {
    name: "noXProle",
    description: "Agrega roles para que no reciban exp y como tambien ver la lista de reoles que no reciben exp",
    category: "🔮 Niveles",
    cooldown: 5,
    memberpermissions: ["MANAGE_ROLES", "MANAGE_GUILD"],
    usage: "noxprole <list/add/remove> <Role>",
    run: async (client, message, args, user, text, prefix) => {
        try {
            await mongo().then(async mongoose => {
                try {
                    const guildID = message.guild.id
                    let role, data = await settingsXP.findOne({ _id: guildID })
                    switch (args[0]) {
                        case "add":
                            if (args[1]) {
                                if (!args[1].includes(`@&`)) return await message.reply(new MessageEmbed()
                                    .setColor(ee.wrongcolor)
                                    .setTitle("⚠ No XP Role")
                                    .setDescription(`Por favor escribe un role valido`)
                                ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                                if (isNaN(args[1])) role = await message.guild.roles.cache.find(c => c.id === args[1].slice(3, -1))
                                if (!isNaN(args[1])) role = await message.guild.roles.cache.find(c => c.id === args[1])
                                if (role == undefined) role = message.guild.roles.cache.find(c => c.name === args[1])
                                if (!role) return await message.reply(new MessageEmbed()
                                    .setColor(ee.wrongcolor)
                                    .setTitle("⚠ No XP Role")
                                    .setDescription(`Por favor escribe un role valido para asignar`)
                                ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                                if (data) {
                                    if (!data.noRoles.includes(role.id))
                                        data.noRoles.push(role.id)
                                    await data.save()
                                    return message.channel.send(new MessageEmbed()
                                        .setColor(ee.checkcolor)
                                        .setTitle("⚠ No XP Role")
                                        .setDescription(`Se agrego correctamente a la lista el role: ${args[1]}`)
                                    )
                                } else {
                                    const newData = new settingsXP({
                                        _id: guildID,
                                        noRoles: [role.id]
                                    })
                                    await newData.save()
                                    return message.channel.send(new MessageEmbed()
                                        .setColor(ee.checkcolor)
                                        .setTitle("⚠ No XP Role")
                                        .setDescription(`Se agrego correctamente a la lista el role: ${args[1]}`)
                                    )
                                }
                            } else return await message.reply(new MessageEmbed()
                                .setColor(ee.color)
                                .setTitle(`⚠ Por favor, dime que realizar`)
                                .setDescription(`Uso: \`${prefix}noXProle <list/add/remove> <Role>\``)
                            ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                        case "remove":
                            if (args[1]) {
                                if (isNaN(args[1])) role = await message.guild.roles.cache.find(c => c.id === args[1].slice(3, -1))
                                if (!isNaN(args[1])) role = await message.guild.roles.cache.find(c => c.id === args[1])
                                if (role == undefined) role = message.guild.roles.cache.find(c => c.name === args[1])
                                if (args[1] == "all") {
                                    const newArray = []
                                    data.noRoles = newArray
                                    await data.save()
                                    return message.channel.send(new MessageEmbed()
                                        .setColor(ee.checkcolor)
                                        .setTitle("⚠ No XP Role")
                                        .setDescription(`Se borro correctamente todos los roles de la lista`)
                                    )
                                }
                                if (!role) return await message.reply(new MessageEmbed()
                                    .setColor(ee.wrongcolor)
                                    .setTitle("⚠ No XP Role")
                                    .setDescription(`Por favor escribe un role valido para eliminar`)
                                ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                                if (data) {
                                    if (data.noRoles.includes(role.id)) {
                                        const newArray = removeItemFromArr(data.noRoles, role.id)
                                        data.noRoles = newArray
                                        await data.save()
                                        return message.channel.send(new MessageEmbed()
                                            .setColor(ee.checkcolor)
                                            .setTitle("⚠ No XP Role")
                                            .setDescription(`Se borro correctamente de la lista el role: ${args[1]}`)
                                        )
                                    } else {

                                        return message.channel.send(new MessageEmbed()
                                            .setColor(ee.wrongcolor)
                                            .setTitle("⚠ No XP Role")
                                            .setDescription(`No encontre ningun role que se llame asi: ${args[1]}`)
                                        )
                                    }
                                }
                            } else return await message.reply(new MessageEmbed()
                                .setColor(ee.color)
                                .setTitle(`⚠ Por favor, dime que realizar`)
                                .setDescription(`Uso: \`${prefix}noXProle <list/add/remove> <Role>\``)
                            ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));

                        case "list":
                            if (data) {
                                role = await message.guild.roles.cache.map(c => c.id)
                                const norolesMap = data.noRoles.map(m => role.includes(m) ? "<@&" + m + ">\n\n" : "")
                                return message.channel.send(new MessageEmbed()
                                    .setTitle("**Roles que no reciben XP**:")
                                    .setDescription(`\n${norolesMap.length > 0 ? norolesMap.join(" ") : "**Ninguno**"}`)
                                )
                            }
                            break;
                        default:
                            return await message.reply(new MessageEmbed()
                                .setColor(ee.color)
                                .setTitle(`⚠ Por favor, dime que realizar`)
                                .setDescription(`Uso: \`${prefix}noXProle <list/add/remove> <Role>\``)
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