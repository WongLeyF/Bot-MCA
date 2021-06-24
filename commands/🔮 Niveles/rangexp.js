const { MessageEmbed, WebhookClient } = require("discord.js")
const ee = require("../../botconfig/embed.json")
const gm = require("../../botconfig/globalMessages.json")
const settingsXP = require("../../models/settingsXp")
const mongo = require('../../handlers/mongo')

module.exports = {
    name: "RangeXP",
    description: "Este comando te permite asignar el minimo y maximo de xp por mensaje, como tambien reiniciarlo a los valores por defecto y mostrar la configuracion actual.",
    category: "🔮 Niveles",
    cooldown: 5,
    memberpermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    usage: "rangexp <min> <max>\nrangexp [default]\nrangexp",
    run: async (client, message, args, user, text, prefix) => {
        try {
            await mongo().then(async mongoose => {
                try {
                    const guildID = message.guild.id
                    let data = await settingsXP.findOne({ _id: guildID })
                    if (args[0] == 'default') {
                        if (data) {
                            data.min_xp = 10
                            data.max_xp = 30
                            await data.save()
                        }
                        return await message.reply(new MessageEmbed()
                            .setColor(ee.color)
                            .setDescription(':white_check_mark: Se han puesto en default el minimo y maximo de experiencia ganada.')
                        ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                    }
                    if (!args[0]) return await message.reply(new MessageEmbed()
                        .setColor(ee.color)
                        .setTitle("⚠ Rango de experiencia por mensaje")
                        .setDescription(`La experiencia minima es: ${data ? data.min_xp ? data.min_xp : 1 : 1}\nLa experiencia maxima es: ${data ? data.max_xp ? data.max_xp : 30 : 30}`)
                    ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                    if (isNaN(args[0]) || isNaN(args[1])) return message.reply(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription('❌ No puedo asignar esto, coloca numeros')
                    ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                    if (args[0] <= 0) return message.reply(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription('❌ La XP minima debe ser mayor a 0')
                    ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                    if (parseInt(args[0], 10) > parseInt(args[1], 10)) return message.reply(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription('❌ La XP minima debe ser menor que la maxima')
                    ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                    if (data) {
                        data.min_xp = args[0]
                        data.max_xp = args[1]
                        await data.save()
                    } else {
                        const newData = new settingsXP({
                            _id: guildID,
                            min_xp: args[0],
                            max_xp: args[1]
                        })
                        await newData.save()
                    }
                    message.channel.send(new MessageEmbed()
                        .setColor(ee.checkcolor)
                        .setTitle("⚠ Rango de experiencia por mensaje")
                        .setDescription(`La experiencia minima es: ${args[0]}\nLa experiencia maxima es: ${args[1]}`)
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