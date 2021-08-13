const { MessageEmbed, Permissions } = require("discord.js");
const { errorMessageEmbed, simpleEmbedField, simpleEmbedDescription } = require("../../handlers/functions")
const ee = require("../../json/embed.json")
const gm = require("../../json/globalMessages.json")
const { Database } = require("quickmongo");
const db = new Database(process.env.mongoPath);

module.exports = {
    name: "RoleReward",
    aliases: ["rreward", "rr"],
    description: "Asigna un rol para un nivel en especifico",
    category: "🔮 Niveles",
    cooldown: 2,
    memberpermissions: [Permissions.FLAGS.MANAGE_ROLES],
    usage: "rolereward [remove/list] <Role> <Nivel>",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const guildID = message.guild.id
            let role, titleEmbed, descEmbed
            if (args[0] == "list") {
                const rolerewardRaw = await db.get(`${message.guild.id}`)
                if (rolerewardRaw) {
                    let rrString = "", temp = ""
                    for (let i in rolerewardRaw) {
                        const rrObjects = await db.get(`${message.guild.id}.${i}`)
                        temp = rrObjects.filter(r => r.roleid != 0).map(r => String(`Nivel: ` + r.lvl + `\nRole: <@&` + r.roleid + `>\n\n`))
                        rrString += temp[0] != undefined ? temp[0] : ""
                    }

                    titleEmbed = `**Role Rewards**:`
                    descEmbed = `\n${rrString == "" ? "**No hay ningun role**" : rrString}`
                    return simpleEmbedField(message, null, null, titleEmbed, descEmbed)

                } else {
                    titleEmbed = `⚠ No hay ningun registro de este server`
                    descEmbed = `Uso: \`${prefix}rolereward [remove/list] <Role> <Nivel>\`\n`
                    return simpleEmbedField(message, ee.wrongcolor, gm.shortTime, titleEmbed, descEmbed)
                }
            }
            if (args[0] == "remove") {

                if (!args[1]) {
                    titleEmbed = `⚠ Por favor, dime que realizar hacer`
                    descEmbed = `Uso: \`${prefix}rolereward remove <Role> <Nivel>\``
                    return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
                }
                if (!args[1].includes(`@&`)) {
                    titleEmbed = `⚠ Role Rewards`
                    descEmbed = `Por favor escribe un rol valido`
                    return simpleEmbedField(message, ee.wrongcolor, gm.shortTime, titleEmbed, descEmbed)
                }
                if (args[1]) {
                    if (isNaN(args[1])) role = message.guild.roles.cache.find(role => role.name === args[1])
                    if (!isNaN(args[1])) role = message.guild.roles.cache.get(args[1].slice(3, -1));
                    if (role == undefined) role = message.guild.roles.cache.get(args[1].slice(3, -1))
                } else {
                    titleEmbed = `⚠ Role Rewards`
                    descEmbed = `Por favor escribe el rol a asignar`
                    return simpleEmbedField(message, ee.wrongcolor, gm.shortTime, titleEmbed, descEmbed)
                }
                const data = await db.exists(`${guildID}.${args[2]}`)
                if (!role) {
                    descEmbed = '❌ No puede encontrar este rol, intenta de nuevo'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, descEmbed)
                }
                if (parseInt(args[2]) < 0) {
                    descEmbed = '❌ El nivel minimo debe ser mayor a 0'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                }
                if (data) {
                    const inputRolLVL = [{
                        lvl: args[2],
                        roleid: 0
                    }]
                    const rolLVL = await db.get(`${guildID}.${args[2]}`)
                    if (rolLVL.find(e => e.roleid == role) != undefined) {
                        Object.assign(rolLVL, inputRolLVL)
                        await db.set(`${guildID}.${args[2]}`, rolLVL).then(console.log);
                        titleEmbed = `⚠ Role Reward`
                        descEmbed = `El rol: ${args[1]} se ha eliminado para el nivel: ${args[2]}`
                        return simpleEmbedField(message, ee.checkcolor, null, titleEmbed, descEmbed)
                    } else {
                        descEmbed = '❌ No tengo registros de ese rol con tal nivel'
                        return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                    }
                } else {
                    descEmbed = '❌ No tengo registros de ese nivel'
                    simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                }
                return
            }
            if (!args[0]) {
                titleEmbed = `⚠ Por favor, dime que realizar hacer`
                descEmbed = `Uso: \`${prefix}rolereward [remove/list] <Role> <Nivel>\``
                return simpleEmbedField(message, ee.wrongcolor, gm.shortTime, titleEmbed, descEmbed)
            }
            if (!args[0].includes(`@&`)) {
                titleEmbed = `⚠ Role Rewards`
                descEmbed = `Por favor escribe un rol valido`
                return simpleEmbedField(message, ee.wrongcolor, gm.shortTime, titleEmbed, descEmbed)
            }
            if (args[0]) {
                if (isNaN(args[0])) role = message.guild.roles.cache.find(role => role.name === args[0])
                if (!isNaN(args[0])) role = message.guild.roles.cache.get(args[0].slice(3, -1));
                if (role == undefined) role = message.guild.roles.cache.get(args[0].slice(3, -1))
            } else {
                titleEmbed = `⚠ Role Rewards`
                descEmbed = `Por favor escribe el rol a asignar`
                return simpleEmbedField(message, ee.wrongcolor, gm.shortTime, titleEmbed, descEmbed)
            }
            const data = await db.exists(`${guildID}.${args[1]}`)
            if (!role) {
                descEmbed = '❌ No puede encontrar este rol, intenta de nuevo'
                return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
            }
            // message.member.guild.roles.add(role);

            if (!args[1]) {
                descEmbed = '❌ El nivel minimo debe ser mayor a 0'
                return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
            }
            if (parseInt(args[1]) < 0) {
                descEmbed = '❌ El nivel minimo debe ser mayor a 0'
                return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
            }
            if (data) {
                const inputRolLVL = [{
                    lvl: args[1],
                    roleid: role.id
                }]
                const rolLVL = await db.get(`${guildID}.${args[1]}`)
                Object.assign(rolLVL, inputRolLVL)
                await db.set(`${guildID}.${args[1]}`, rolLVL).then(console.log);
            } else {
                db.push(`${guildID}.${args[1]}`, {
                    lvl: args[1],
                    roleid: role.id
                }).then(console.log);
            }
            titleEmbed = `⚠ Role Reward`
            descEmbed = `El rol: ${args[0]} se asignara al nivel: ${args[1]}`
            simpleEmbedField(message, ee.checkcolor, null, titleEmbed, descEmbed)

        } catch (e) {
            console.log(String(e.stack).bgRed)
            errorMessageEmbed(e, message)
        }
    },
}