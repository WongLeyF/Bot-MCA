const { MessageEmbed, Permissions, Constants } = require("discord.js");
const { errorMessageEmbed, simpleEmbedField, simpleEmbedDescription } = require("../../handlers/functions")
const ee = require("../../json/embed.json");
const gm = require("../../json/globalMessages.json");
module.exports = {
    name: "Unban",
    description: "Desbanear miembros del servidor",
    category: "☠️ Moderación",
    cooldown: 2,
    memberpermissions: [Permissions.FLAGS.BAN_MEMBERS],
    usage: "unban <ID> [Razón de expulsión]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            let titleEmbed = `:warning: Por favor, especifica al usuario`
            let descEmbed = `Uso: \`${prefix}unban <Tag/ID> [Razón]\``
            if (!args[0]) {
                return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
            }
            let reason = !args.slice(1).join(" ") ? 'Sin especificar' : args.slice(1).join(" ");
            await message.guild.members.unban(args[0], reason).then(user => {
                descEmbed = `✅ **${user.username}** ha sido desbaneado del server!`
                simpleEmbedDescription(message, ee.color, gm.longTime, descEmbed)
            })

        } catch (e) {
            let errMs = (e.code === Constants.APIErrors.UNKNOWN_USER ?
                'Usuario no encontrado o no existe' : e.code === Constants.APIErrors.UNKNOWN_BAN ?
                    'Este usuario no esta en la lista de baneados' : e.code === 50035 ? 'No se puede desbanear' : `\`\`\`${e.stack}\`\`\``)
            if (errMs != e.stack) {
                titleEmbed = `:warning: Algo salió mal`
                return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, errMs)
            }
            else {
                errorMessageEmbed(e, message)
            }
        }
    }
};
