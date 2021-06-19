const { MessageEmbed, WebhookClient } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
const mongo = require('../../handlers/mongo')
const settingsconfessionSchema = require('../../models/setting_schema')

module.exports = {
    name: "setConfession",
    aliases: ["sc", "setsecret"],
    description: "Establece un canal para recibir confesiones\nPara deshabilitar no ingreses el canal.",
    category: "⚙ Configuración",
    cooldown: 10,
    memberpermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    usage: "setconfession [Canal/ID]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            await mongo().then(async mongoose => {
                try {
                    const guildID = message.guild.id
                    const channelID = args[0] ? args[0].replace('<#', '').replace('>', '') : ""
                    const channel = client.channels.cache.get(channelID)
                    let data = await settingsconfessionSchema.findOne({ _id: guildID });
                    if (!args[0]) {
                        if (data) {
                            data.confessionChannel = ""
                            await data.save()
                        }
                        return message.reply(new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription('❌ Se han sido desactivado las confesiones.')
                        ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                    }
                    if (!channel) return message.reply(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription('❌ No puedo reconocer este canal')
                    ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                    if (data) {
                        data.confessionChannel = channelID
                        await data.save()
                    } else {
                        let newData = new settingsconfessionSchema({
                            _id: guildID,
                            confessionChannel: channelID,
                        });
                        await newData.save()
                    }
                    message.channel.send(new MessageEmbed()
                        .setColor(ee.color)
                        .setDescription(`:white_check_mark: Las confesiones se enviarán al canal: \`${channel.name}\` `)
                    );
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