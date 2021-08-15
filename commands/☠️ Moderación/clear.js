const { errorMessageEmbed, simpleEmbedDescription } = require("../../handlers/functions")
const ee = require("../../json/embed.json");
const gm = require("../../json/globalMessages.json");

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
            if (!amount) {
                const desc = '❌ Necesitas darme un numero de mensajes a eliminar'
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
            }
            if (amount <= 1) {
                const desc = `❌ Necesitas borrar mas de un mensaje`
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
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
                await message.channel.messages.fetch({ limit: parseInt(amount) + 1 }).then(async messages => {
                    await message.channel.bulkDelete(messages).catch(async () => {
                        await message.channel.bulkDelete(messages, true).then(msg => {
                            const desc = "❌ No puedo borrar mensajes de mas de 14 dias"
                            simpleEmbedDescription(message, ee.wrongcolor, gm.slowTime, desc, true)
                        })
                    })
                })
            }
            message.channel.send({
                content: `:white_check_mark: Se han borrado ${amount} mensajes`
            }).then(msg => setTimeout(() => msg.delete(), 5000)).catch(e => console.log(gm.errorDeleteMessage.gray));
        } catch (e) {
            if (e.code === 50035) {
                const desc = "❌ Necesitas darme un numero de mensajes a eliminar"
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
            }
            console.log(String(e.stack).bgRed)
            errorMessageEmbed(e, message)
        }
    }
};