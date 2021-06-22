const { MessageEmbed, WebhookClient } = require("discord.js")
const ee = require("../../botconfig/embed.json")
const gm = require("../../botconfig/globalMessages.json")
const settingsXP = require("../../models/settingsXp")
const mongo = require('../../handlers/mongo')

module.exports = {
    name: "CooldownXP",
    description: "Muestra el cooldown por mensaje, asigna un cooldown o establecelo por defecto",
    category: "🔮 Niveles",
    cooldown: 5,
    memberpermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    usage: "cooldownxp <tiempo en segundos>\ncooldownxp [default]\ncooldownxp",
    run: async (client, message, args, user, text, prefix) => {
        try {
            await mongo().then(async mongoose => {
                try {
                    const guildID = message.guild.id
                    let data = await settingsXP.findOne({ _id: guildID })
                    if (args[0] == 'default') {
                        if (data) {
                            data.cooldown = 60
                            await data.save()
                        }
                        return await message.reply(new MessageEmbed()
                            .setColor(ee.color)
                            .setDescription(':white_check_mark: Se han puesto en default el tiempo para conseguir experiencia por mensaje.')
                        ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                    }
                    if (!args[0]) return await message.reply(new MessageEmbed()
                        .setColor(ee.color)
                        .setTitle("⚠ Tiempo para experiencia por mensaje")
                        .setDescription(`El tiempo de espera esta asignado en: ${data ? data.cooldown : 60} segundo(s)`)
                    ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                    if (isNaN(args[0])) return message.reply(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription('❌ No puedo asignar esto, coloca numeros')
                    ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                    if (args[0] <= 0) return message.reply(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription('❌ El tiempo debe ser mayor a 0')
                    ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                    if (data) {
                        data.cooldown = args[0]
                        await data.save()
                    } else {
                        const newData = new settingsXP({
                            _id: guildID,
                            cooldown: args[0]
                        })
                        await newData.save()
                    }
                    message.channel.send(new MessageEmbed()
                        .setColor(ee.checkcolor)
                        .setTitle("⚠ Tiempo para experiencia por mensaje")
                        .setDescription(`El tiempo de espera se asigno en: ${args[0]} segundo(s)`)
                    )
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