const { MessageEmbed } = require("discord.js");
const { errorMessageEmbed, simpleEmbedDescription } = require("../../handlers/functions")
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");

module.exports = {
    name: "Clear",
    aliases: ["purge"],
    description: "Borrar mensajes",
    category: "☠️ Moderación",
    cooldown: 2,
    memberpermissions: ["MANAGE_MESSAGES"],
    usage: "clear <# de mensajes>",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const amount = args[0]
            if (!amount){
                const desc = '❌ Necesitas darme un numero de mensajes a eliminar'
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc)
            }
            if (amount <= 1){
                const desc = `❌ Necesitas borrar mas de un mensaje`
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc)
            }
            if (amount >= 100) {
                let aux, messageTodelete = amount
                do {
                    aux = messageTodelete >= 100 ? 100 : (parseInt(messageTodelete) + 1)
                    await message.channel.messages.fetch({ limit: aux }).then(messages => {
                        message.channel.bulkDelete(messages)
                        messageTodelete = messageTodelete - 100
                    })
                } while (messageTodelete > 0);
            } else {
                await message.channel.messages.fetch({ limit: parseInt(amount) + 1 }).then(messages => {
                    message.channel.bulkDelete(messages)
                })
            }
            message.channel.send(`:white_check_mark: Se han borrado ${amount} mensajes`
            ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
        } catch (e) {
            if (e.code === 50035) {
                const desc = "❌ Necesitas darme un numero de mensajes a eliminar"
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc)
            }
            console.log(String(e.stack).bgRed)
            errorMessageEmbed(e, message)
        }
    }
};