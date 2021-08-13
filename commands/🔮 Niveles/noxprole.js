const ee = require("../../json/embed.json")
const gm = require("../../json/globalMessages.json")
const { errorMessageEmbed, simpleEmbedDescription, simpleEmbedField, getRole } = require("../../handlers/functions");
const { noXpRoles } = require("../../handlers/controllers/settingsXp.controllers");
const { Permissions } = require("discord.js");

module.exports = {
    name: "noXProle",
    description: "Agrega roles para que no reciban exp y como tambien ver la lista de reoles que no reciben exp",
    category: "🔮 Niveles",
    cooldown: 5,
    memberpermissions: [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.MANAGE_GUILD],
    usage: "noxprole <list/add/remove> <Role>",
    run: async (client, message, args, user, text, prefix) => {
        try {
            let role
            let titleEmbed = `⚠ No XP Role`, descEmbed
            switch (args[0]) {
                case "add":
                    if (args[1]) {
                        if (!args[1].includes(`@&`)) {
                            descEmbed = `❌ Por favor escribe un role valido`
                            return simpleEmbedField(message, ee.wrongcolor, gm.slowTime, titleEmbed, descEmbed)
                        }
                        role = await getRole(message, args[1])
                        if (!role) {
                            descEmbed = `❌ Por favor escribe un role valido para asignar`
                            return simpleEmbedDescription(message, ee.wrongcolor, gm.slowTime, descEmbed)
                        }
                        if (noXpRoles(message, role, 'add')) {
                            descEmbed = `Se agrego correctamente a la lista el role: ${args[1]}`
                            return simpleEmbedDescription(message, ee.checkcolor, null, descEmbed)
                        } else {
                            descEmbed = `❌ Algo salio mal, intentalo de nuevo`
                            return simpleEmbedField(message, ee.checkcolor, null, titleEmbed, descEmbed)
                        }

                    } else {
                        titleEmbed = `⚠ Por favor, dime que realizar`
                        descEmbed = `Uso: \`${prefix}noXProle <list/add/remove> <Role>\``
                        return simpleEmbedField(message, ee.color, gm.longTime, titleEmbed, descEmbed)
                    }

                case "remove":
                    if (args[1]) {
                        if (args[1] == "all") {
                            if (noXpRoles(message, role, 'remove-all')) {
                                descEmbed = `Se borro correctamente todos los roles de la lista`
                                return simpleEmbedField(message, ee.checkcolor, null, titleEmbed, descEmbed)
                            }
                        }
                        role = await getRole(message, args[1])
                        if (!role) {
                            descEmbed = `❌ No encontre ningun role que se llame asi: ${args[1]}`
                            return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
                        }
                        if (noXpRoles(message, role, 'remove')) {
                            descEmbed = `Se borro correctamente de la lista el role: ${args[1]}`
                            return simpleEmbedDescription(message, ee.checkcolor, null, descEmbed)
                        } else {
                            descEmbed = `❌  No encontre ningun role que se llame asi: ${args[1]}`
                            return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
                        }
                    } else {
                        titleEmbed = `⚠ Por favor, dime que realizar`
                        descEmbed = `Uso: \`${prefix}noXProle <list/add/remove> <Role>\``
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.slowTime, titleEmbed, descEmbed)
                    }
                case "list":
                    noXpRoles(message, role, 'list')
                    break;
                default:
                    titleEmbed = `⚠ Por favor, dime que realizar`
                    descEmbed = `Uso: \`${prefix}noXProle <list/add/remove> <Role>\``
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.slowTime, titleEmbed, descEmbed)
            }

        } catch (e) {
            console.log(String(e.stack).bgRed);
            errorMessageEmbed(e, message)
        }
    },
};