const { MessageEmbed } = require("discord.js");
const { errorMessageEmbed, simpleEmbedDescription } = require("../../handlers/functions")
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");

const channelPollID = ['831738824639905812',]

module.exports = {
    name: "Poll",
    aliases: ["encuesta", "sug"],
    description: "Agrega automáticamente reacciones para votar al último mensaje enviado o al mensaje con el ID asignado.",
    category: "🧰 Utilidades",
    cooldown: 5,
    usage: "poll [ID del mensaje]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            let fetched
            await message.delete()
            if (args.length === 0) {
                fetched = await message.channel.messages.fetch({ limit: 1 })
            } else {
                fetched = await message.channel.messages.fetch(args[0])
            }
            const addReactions = (message) => {
                message.react('✔')
                setTimeout(() => {
                    message.react('❌')
                }, 750)
            }
            if (args.length !== 0) {
                addReactions(fetched)
            } else {
                if (fetched && fetched.first()) addReactions(fetched.first())
            }

        } catch (e) {
            let descEmbed
            if (e.code === 50035) {
                descEmbed = `❌ Necesitas darme un ID de mensaje`
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, descEmbed)
            }
            if (e.code === 10008) {
                descEmbed = `❌ No pude reconocer ese ID, ¿Seguro que es del mensaje?`
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, descEmbed)
            }
            console.log(String(e.stack).bgRed);
            errorMessageEmbed(e, message)
        }
    },
};