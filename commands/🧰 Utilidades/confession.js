const { MessageEmbed } = require("discord.js");
const ee = require("../../json/embed.json");
const gm = require("../../json/globalMessages.json");
const { errorMessageEmbed, simpleEmbedDescription, simpleEmbedField } = require("../../handlers/functions");
const { getChannelConfession } = require("../../handlers/controllers/settings.controller");

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
            let titleEmbed, descEmbed
            if (!channelID) {
                message.delete()
                descEmbed = `❌ El canal para recibir confesiones no ha sido establecido en este servidor.`
                simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, descEmbed);
                descEmbed = `🔎 Usa el comando \`${prefix}setconfessions <channel>\`.`
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTimem, descEmbed)
            }
            if (!args[0] || (args[0] == "-n")) {
                titleEmbed = `:warning: | Debes ingresar algo que confesar.`
                descEmbed = `Uso: \`${prefix}confession <texto> [-n]\``
                return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
            }
            const text = args[args.length - 1] == "-n" ? args.slice(0, -1).join(" ") : args.slice(0).join(" ")
            if (args[args.length - 1] == "-n") {
                message.delete()
                return client.channels.cache.get(channelID).send({
                    embeds: [new MessageEmbed()
                        .setTitle("Confesiones 🤫")
                        .setColor(ee.color)
                        .setDescription(text)
                        .setFooter(message.author.tag)]
                })
            } else {
                message.delete()
                return client.channels.cache.get(channelID).send({
                    embeds: [new MessageEmbed()
                        .setTitle("Confesiones 🤫")
                        .setColor(ee.color)
                        .setDescription(text)]
                })
            }
        } catch (e) {
            console.log(String(e.stack).bgRed);
            errorMessageEmbed(e, message)
        }
    },
};