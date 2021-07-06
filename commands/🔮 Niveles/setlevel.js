const { MessageEmbed } = require("discord.js");
const { errorMessageEmbed, simpleEmbedField, simpleEmbedDescription } = require("../../handlers/functions")
const ee = require("../../botconfig/embed.json")
const gm = require("../../botconfig/globalMessages.json")
const Levels = require("discord-xp");

module.exports = {
    name: "setLevel",
    aliases: ["setlvl"],
    description: "Permite establecer, agregar o quitar niveles\nadd = Agrega cierta cantidad de niveles a los actuales\n set = Establece un nivel en especifico\nsub = Quita una cantidad de niveles",
    category: "🔮 Niveles",
    cooldown: 2,
    memberpermissions: ["ADMINISTRATOR"],
    usage: "setlevel <add/set/sub> <mencion/ID> <nivel>",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const options = ["add", "set", "sub"]
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            let titleEmbed, descEmbed
            if (!args[0] || !options.includes(args[0])) {
                titleEmbed = `⚠ Por favor, dime que realizar hacer`
                descEmbed = `Uso: \`${prefix}setlevel <add/set/sub> <mencion/ID> <nivel>\``
                return simpleEmbedField(message, ee.wrongcolor, gm.slowTime, titleEmbed, descEmbed)
            }
            if (!args[1]) {
                descEmbed = `⚠ Por favor, especifica al usuario`
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, descEmbed)
            }
            if (!member) {
                descEmbed = `⚠ Por favor, especifica un usuario valido`
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, descEmbed)
            }
            if (!args[2]) {
                descEmbed = `⚠ Por favor, especifica el nivel`
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, descEmbed)
            }
            if (isNaN(args[2])) {
                descEmbed = `⚠ Por favor, escribe un numero valido para el nivel`
                return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
            }

            switch (args[0]) {
                case 'add':

                    if (await Levels.appendLevel(member.id, message.guild.id, args[2])) {
                        descEmbed = `Se agregaron a ${member} estos niveles: ${args[2]}`
                        return simpleEmbedDescription(message, ee.color, null, descEmbed)
                    } else {
                        descEmbed = `❌ No pude realizar la operacion, intentalo de nuevo`
                        return simpleEmbedDescription(message, ee.wrongcolor, shortTime, descEmbed)
                    }

                case 'set':
                    if (await Levels.setLevel(member.id, message.guild.id, args[2])) {
                        descEmbed = `El nuevo nivel de ${member} es: ${args[2]}`
                        return simpleEmbedDescription(message, ee.color, null, descEmbed)
                    } else {
                        descEmbed = `❌ No pude realizar la operacion, intentalo de nuevo`
                        return simpleEmbedDescription(message, ee.wrongcolor, shortTime, descEmbed)
                    }

                case 'sub':
                    if (await Levels.subtractLevel(member.id, message.guild.id, args[2])) {
                        descEmbed = `Se restaron a ${member} estos niveles: ${args[2]}`
                        return simpleEmbedDescription(message, ee.color, null, descEmbed)
                    } else {
                        descEmbed = `❌ No pude realizar la operacion, intentalo de nuevo`
                        return simpleEmbedDescription(message, ee.wrongcolor, shortTime, descEmbed)
                    }

                default:
                    titleEmbed = `⚠ Por favor, dime que realizar hacer, \`${args[0]}\` no lo reconozco como accion`
                    descEmbed = `Uso: \`${prefix}setlevel <add/set/sub> <mencion/ID> <nivel>\``
                    return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errorMessageEmbed(e, message)
        }
    },
}