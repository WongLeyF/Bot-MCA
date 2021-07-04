const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
const { getChannelConfession, errorMessageEmbed } = require("../../handlers/functions");

module.exports = {
    name: "Confession",
    aliases: ["confesion", "secret", "cf"],
    description: "Envía una confesión de forma anónima.\nPuedes añadir \`-n\` para que aparezca tu nombre.",
    category: "🧰 Utilidades",
    cooldown: 0,
    usage: "confession <texto> [-n]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const channelID = await getChannelConfession(message)
            if (!channelID) {
                message.delete()
                message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription('❌ El canal para recibir confesiones no ha sido establecido en este servidor.')
                ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription(`🔎 Usa el comando \`${prefix}setconfessions <channel>\`.`)
                ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
            }
            if (!args[0] || (args[0] == "-n")) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`:warning: | Debes ingresar algo que confesar.`)
                .setDescription(`Uso: \`${prefix}confession <texto> [-n]\``)
            ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
            let text = args[args.length - 1] == "-n" ? args.slice(0, -1).join(" ") : args.slice(0).join(" ")
            if (args[args.length - 1] == "-n") {
                message.delete()
                return client.channels.cache.get(channelID).send(new MessageEmbed()
                    .setTitle("Confesiones 🤫")
                    .setColor(ee.color)
                    .setDescription(text)
                    .setFooter(message.author.tag))
            } else {
                message.delete()
                return client.channels.cache.get(channelID).send(new MessageEmbed()
                    .setTitle("Confesiones 🤫")
                    .setColor(ee.color)
                    .setDescription(text))
            }
        } catch (e) {
            console.log(String(e.stack).bgRed);
            errorMessageEmbed(e, message)
        }
    },
};