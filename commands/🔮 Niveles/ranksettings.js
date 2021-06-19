const { MessageEmbed, WebhookClient } = require("discord.js")
const ee = require("../../botconfig/embed.json")
const gm = require("../../botconfig/globalMessages.json")
const userSettings = require("../../models/usersettings")
const mongo = require('../../handlers/mongo')

module.exports = {
    name: "RankSetting",
    description: "Este comando te permite cambiar ciertos aspectos a la tarjeta del rango.\nPara mas info coloca solo ranksettings <img|bar|status|color>",
    category: "🔮 Niveles",
    cooldown: 5,
    usage: "ranksetting <img|bar|status|color> [URL|HEX|STATUS]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            await mongo().then(async mongoose => {
                const guildID = message.guild.id
                const member = message.author;
                let data = await userSettings.findOne({ guildId: guildID, userId: member.id })
                try {
                    switch (args[0]) {
                        case "img":
                            if (!args[1]) return message.reply(new MessageEmbed()
                                .setColor(ee.color)
                                .setTitle("⚠ Info IMG")
                                .setDescription(`Coloca el link de la imagen que deseas, debe terminar en formato de imagen (png, jpg, jpeg, etc.)\n Ejemplo del comando \`${prefix}ranksetting img https://i.imgur.com/B7oECZe.jpeg\``)
                            ).then(msg => msg.delete({ timeout: 50000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                            if (data) {
                                data.imgRank = args[1]
                                await data.save()
                            } else {
                                const newData = new userSettings({
                                    userId: member.id,
                                    guildId: guildID,
                                    imgRank: args[1],
                                    colorBackground: "#000"
                                })
                                await newData.save()
                            }
                            break;
                        case "bar":
                            if (!args[1]) return message.reply(new MessageEmbed()
                                .setColor(ee.color)
                                .setTitle("⚠ Info BAR")
                                .setDescription(`Coloca el color que deseas en HEX, debe tener minimo las tres primeros caracteres "#ABC"\n Ejemplo del comando \`${prefix}ranksetting bar "#ABC"\``)
                            ).then(msg => msg.delete({ timeout: 50000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                            if (!/^#([0-9A-F]{3}){1,2}$/i.test(args[1])) return message.reply(new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setTitle("⚠ Color invalido")
                                .setDescription(`Coloca un color tipo HEX`)
                            ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                            if (data) {
                                data.colorBar = args[1]
                                await data.save()
                            } else {
                                const newData = new userSettings({
                                    userId: member.id,
                                    guildId: guildID,
                                    colorBar: args[1]
                                })
                                await newData.save()
                            }
                            break;
                        case "status":
                            // , default: 'online', enum: ['idle', 'dnd', 'offline', 'streaming']
                            if (!args[1]) return message.reply(new MessageEmbed()
                                .setColor(ee.color)
                                .setTitle("⚠ Info STATUS")
                                .setDescription(`Coloca el estado de discord, solo se se pueden asignar: online, idle, dnd, offline y streaming \n Ejemplo del comando \`${prefix}ranksetting status online\``)
                            ).then(msg => msg.delete({ timeout: 50000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                            let status = "online"
                            switch (args[1]) {
                                case "idle":
                                    status = args[1]
                                    break;
                                case "dnd":
                                    status = args[1]
                                    break;
                                case "offline":
                                    status = args[1]
                                    break;
                                case "streaming":
                                    status = args[1]
                                    break;

                                default:
                                    status = "online"
                                    break;
                            }
                            if (data) {
                                data.colorStatus = status
                                await data.save()
                            } else {
                                const newData = new userSettings({
                                    userId: member.id,
                                    guildId: guildID,
                                    colorStatus: status
                                })
                                await newData.save()
                            }
                            break;
                        case "color":
                            if (!args[1]) return message.reply(new MessageEmbed()
                                .setColor(ee.color)
                                .setTitle("⚠ Info COLOR")
                                .setDescription(`Coloca el color que deseas en HEX, debe tener minimo las tres primeros caracteres "#ABC"\n Ejemplo del comando \`${prefix}ranksetting color "#ABC"\``)
                            ).then(msg => msg.delete({ timeout: 50000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                            if (!/^#([0-9A-F]{3}){1,2}$/i.test(args[1])) return message.reply(new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setTitle("⚠ Color invalido")
                                .setDescription(`Coloca un color tipo HEX`)
                            ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                            if (data) {
                                data.colorBackground = args[1]
                                data.imgRank = null
                                await data.save()
                            } else {
                                const newData = new userSettings({
                                    userId: member.id,
                                    guildId: guildID,
                                    colorBackground: args[1]
                                })
                                await newData.save()
                            }
                            break;

                        default:
                            return message.channel.send(new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setTitle(`⚠ Por favor, dime que realizar hacer, ${args[0] == undefined ? "" : `\`${args[0]}\``} no lo reconozco como accion`)
                                .setDescription(`Uso: \`${prefix}ranksetting <img|bar|status|color> [URL|HEX|STATUS]\``))
                    }
                    message.channel.send(new MessageEmbed()
                        .setColor(ee.checkcolor)
                        .setDescription(`Tus cambios han sido guardados`)
                    )


                } finally {

                    mongoose.connection.close()
                }
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
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
}