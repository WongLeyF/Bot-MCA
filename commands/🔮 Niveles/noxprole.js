const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json")
const gm = require("../../botconfig/globalMessages.json")
const settingsXP = require("../../models/settingsXp")
const mongo = require('../../handlers/mongo')
const { removeItemFromArr, errorMessageEmbed } = require("../../handlers/functions")

module.exports = {
    name: "noXProle",
    description: "Agrega roles para que no reciban exp y como tambien ver la lista de reoles que no reciben exp",
    category: "🔮 Niveles",
    cooldown: 5,
    memberpermissions: ["MANAGE_ROLES", "MANAGE_GUILD"],
    usage: "noxprole <list/add/remove> <Role>",
    run: async (client, message, args, user, text, prefix) => {
        try {
            await mongo().then(async mongoose => {
                try {
                    const guildID = message.guild.id
                    let role, data = await settingsXP.findOne({ _id: guildID })
                    let titleEmbed = `⚠ No XP Role`, descEmbed
                    switch (args[0]) {
                        case "add":
                            if (args[1]) {
                                if (!args[1].includes(`@&`)) {
                                    descEmbed = `Por favor escribe un role valido`
                                    return simpleEmbedField(message, ee.wrongcolor, gm.slowTime, titleEmbed, descEmbed)
                                }
                                if (isNaN(args[1])) role = await message.guild.roles.cache.find(c => c.id === args[1].slice(3, -1))
                                if (!isNaN(args[1])) role = await message.guild.roles.cache.find(c => c.id === args[1])
                                if (role == undefined) role = message.guild.roles.cache.find(c => c.name === args[1])
                                if (!role){
                                    descEmbed = `Por favor escribe un role valido para asignar`
                                    return simpleEmbedDescription(message, ee.wrongcolor, gm.slowTime, titleEmbed, descEmbed)
                                } 
                                if (data) {
                                    if (!data.noRoles.includes(role.id))
                                        data.noRoles.push(role.id)
                                    await data.save()
                                    descEmbed = `Se agrego correctamente a la lista el role: ${args[1]}`
                                    return simpleEmbedDescription(message, ee.checkcolor, null, titleEmbed, descEmbed)
                                } else {
                                    const newData = new settingsXP({
                                        _id: guildID,
                                        noRoles: [role.id]
                                    })
                                    await newData.save()
                                    descEmbed = `Se agrego correctamente a la lista el role: ${args[1]}`
                                    return simpleEmbedDescription(message, ee.checkcolor, null, titleEmbed, descEmbed)
                                    
                                }
                            } else {
                                titleEmbed = `⚠ Por favor, dime que realizar`
                                descEmbed = `Uso: \`${prefix}noXProle <list/add/remove> <Role>\``
                                return simpleEmbedField(message, ee.color, gm.longTime, titleEmbed, descEmbed)
                            } 
                        case "remove":
                            if (args[1]) {
                                if (isNaN(args[1])) role = await message.guild.roles.cache.find(c => c.id === args[1].slice(3, -1))
                                if (!isNaN(args[1])) role = await message.guild.roles.cache.find(c => c.id === args[1])
                                if (role == undefined) role = message.guild.roles.cache.find(c => c.name === args[1])
                                if (args[1] == "all") {
                                    const newArray = []
                                    data.noRoles = newArray
                                    await data.save()

                                    descEmbed = `Se borro correctamente todos los roles de la lista`
                                    return simpleEmbedDescription(message, ee.checkcolor, null, titleEmbed, descEmbed)
                                    
                                }
                                if (!role){
                                    descEmbed = `Por favor escribe un role valido para eliminar`
                                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
                                } 
                                if (data) {
                                    if (data.noRoles.includes(role.id)) {
                                        const newArray = removeItemFromArr(data.noRoles, role.id)
                                        data.noRoles = newArray
                                        await data.save()

                                        descEmbed = `Se borro correctamente de la lista el role: ${args[1]}`
                                        return simpleEmbedDescription(message, ee.checkcolor, null, titleEmbed, descEmbed)

                                    } else {

                                        descEmbed = `No encontre ningun role que se llame asi: ${args[1]}`
                                        return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)

                                    }
                                }
                            } else {
                                titleEmbed = `⚠ Por favor, dime que realizar`
                                descEmbed = `Uso: \`${prefix}noXProle <list/add/remove> <Role>\``
                                return simpleEmbedDescription(message, ee.wrongcolor, gm.slowTime, titleEmbed, descEmbed)
                            } 
                        case "list":
                            if (data) {
                                role = await message.guild.roles.cache.map(c => c.id)
                                const norolesMap = data.noRoles.map(m => role.includes(m) ? "<@&" + m + ">\n\n" : "")
                                return message.channel.send(new MessageEmbed()
                                    .setTitle("**Roles que no reciben XP**:")
                                    .setDescription(`\n${norolesMap.length > 0 ? norolesMap.join(" ") : "**Ninguno**"}`)
                                )
                            }
                            break;
                        default:
                            titleEmbed = `⚠ Por favor, dime que realizar`
                            descEmbed = `Uso: \`${prefix}noXProle <list/add/remove> <Role>\``
                            return simpleEmbedDescription(message, ee.wrongcolor, gm.slowTime, titleEmbed, descEmbed)
                    }
                } finally {
                    mongoose.connection.close()
                }
            })
        } catch (e) {
            console.log(String(e.stack).bgRed);
            errorMessageEmbed(e, message)
        }
    },
};