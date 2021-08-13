const { MessageEmbed, Permissions } = require("discord.js");
const { errorMessageEmbed, simpleEmbedField, simpleEmbedDescription } = require("../../handlers/functions")
const ee = require("../../json/embed.json")
const gm = require("../../json/globalMessages.json")
const Levels = require("discord-xp");

module.exports = {
    name: "setXP",
    description: "Permite establecer, agregar o quitar experiencia\nadd = Agrega cierta cantidad de experiencia a los actuales\n set = Establece una cantidad de xp en especifica\nsub = Quita una cantidad de experiencia",
    category: "🔮 Niveles",
    cooldown: 2,
    memberpermissions: [Permissions.FLAGS.ADMINISTRATOR],
    usage: "setxp <add/set/sub> <mencion/ID> <nivel>",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const options = ["add", "set", "sub"]
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            let titleEmbed, descEmbed
            if (!args[0] || !options.includes(args[0])) {
                titleEmbed = `⚠ Por favor, dime que realizar hacer`
                descEmbed = `Uso: \`${prefix}setxp <add/set/sub> <mencion/ID> <nivel>\``
                return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
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
                descEmbed = `⚠ Por favor, especifica la cantidad de experiencia`
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, descEmbed)
            }
            if (isNaN(args[2])) {
                descEmbed = `⚠ Por favor, especifica una cantidad de experiencia valida`
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, descEmbed)
            }

            switch (args[0]) {
                case 'add':
                    if (await Levels.appendXp(member.id, message.guild.id, args[2])) {
                        descEmbed = `Se agregaron a ${member} esta cantidad de xp: ${args[2]}`
                        return simpleEmbedDescription(message, ee.color, null, descEmbed)
                    } else {
                        descEmbed = `❌ No pude realizar la operacion, intentalo de nuevo`
                        return simpleEmbedDescription(message, ee.wrongcolor, shortTime, descEmbed)
                    }
                    
                case 'set':
                    if (await Levels.setXp(member.id, message.guild.id, args[2])) {
                        descEmbed = `La nueva experiencia de ${member} es: ${args[2]}`
                        return simpleEmbedDescription(message, ee.color, null, descEmbed)
                    } else {
                        descEmbed = `❌ No pude realizar la operacion, intentalo de nuevo`
                        return simpleEmbedDescription(message, ee.wrongcolor, shortTime, descEmbed)
                    }
                    
                case 'sub':
                    if (await Levels.subtractXp(member.id, message.guild.id, args[2])) {
                        descEmbed = `Se restaron a ${member} esta cantidad de xp: ${args[2]}`
                        return simpleEmbedDescription(message, ee.color, null, descEmbed)
                    } else {
                        descEmbed = `❌ No pude realizar la operacion, intentalo de nuevo`
                        return simpleEmbedDescription(message, ee.wrongcolor, shortTime, descEmbed)
                    }
                    
                default:
                    titleEmbed = `⚠ Por favor, dime que realizar hacer, \`${args[0]}\` no lo reconozco como accion`
                    descEmbed = `Uso: \`${prefix}setxp <add/set/sub> <mencion/ID> <nivel>\``
                    return simpleEmbedField(message, ee.wrongcolor, gm.slowTime, titleEmbed, descEmbed)
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errorMessageEmbed(e, message)
        }
    },
}