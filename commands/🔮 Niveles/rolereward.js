const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require("discord.js")
const { errorMessageEmbed, simpleEmbedField, simpleEmbedDescription, getRole } = require("../../handlers/functions")
const ee = require("../../json/embed.json")
const gm = require("../../json/globalMessages.json")
const _settingsXP = require("../../models/settingsXP.model")

module.exports = {
    name: "RoleReward",
    aliases: ["rreward", "rr"],
    description: "Asigna un rol para un nivel en especifico",
    category: "🔮 Niveles",
    cooldown: 2,
    memberpermissions: ["MANAGE_ROLES"],
    usage: "rolereward [remove/list] <Role> <Nivel>",
    run: async (client, message, args, user, text, prefix) => {
        try {
            let roleData, titleEmbed, descEmbed
            const guildID = message.guild.id

            const listOfRolesAndLevels = () => {
                _settingsXP.findOne({ _id: guildID }, (err, res) => {
                    if (err) {
                        console.log(String(err.stack).bgRed);
                        errorMessageEmbed(err, message)
                    }
                    if (res) {
                        let listRoleRewards = []
                        let options = []

                        for (let i in res.rolesLevel) {
                            const rolesLevelValues = res.rolesLevel[i]
                            if (rolesLevelValues.role.length > 0) {
                                message.guild.roles.cache.filter(f => rolesLevelValues.role.includes(f.id)).map(m => {
                                    options.push({
                                        label: m.name,
                                        value: m.id,
                                        description: `Click para eliminar el role de ${message.guild.roles.cache.get(m.id).name}`,
                                        emoji: '🏅'
                                    })
                                });

                                if (options.length === 0) return;
                                const row = new MessageActionRow().addComponents(
                                    new MessageSelectMenu()
                                        .setCustomId(`rolereward ${i}`)
                                        .setPlaceholder(`Roles de recompensa para nivel ${res.rolesLevel[i]._id}`)
                                        .addOptions(options)
                                )

                                listRoleRewards.push(row)
                                options = []
                            }
                        }

                        if (listRoleRewards.length === 0) {
                            return simpleEmbedDescription(message, 'RED', 10000, '❌ No encontre nada en la lista');
                        }

                        message.channel.send({
                            embeds: [new MessageEmbed().setDescription('🏆 **Roles de recompensa por nivel**').setColor("GREEN")],
                            components: listRoleRewards
                        })
                        
                    } else {
                        titleEmbed = `⚠ No hay ningun registro de este server`
                        descEmbed = `Uso: \`${prefix}rolereward [remove/list] <Role> <Nivel>\`\n`
                        return simpleEmbedField(message, ee.wrongcolor, gm.shortTime, titleEmbed, descEmbed)
                    }
                })
            }

            const removeRoleInLevel = async (inputRole, inputLevel) => {
                if (isValid(inputRole, inputLevel)) {
                    const errorValidation = isValid(inputRole, inputLevel)
                    return simpleEmbedField(message, ee.color, gm.largeTime, errorValidation.titleEmbed, errorValidation.descEmbed)
                }
                roleData = await getRole(message, inputRole)
                if (!roleData) {
                    descEmbed = '❌ No puede encontrar este rol, intenta de nuevo'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, descEmbed)
                }
                if (parseInt(inputLevel) < 0) {
                    descEmbed = '❌ El nivel minimo debe ser mayor a 0'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                }

                _settingsXP.findOne({ _id: guildID }, (err, res) => {
                    if (err) {
                        console.log(String(err.stack).bgRed);
                        errorMessageEmbed(err, message)
                    }
                    if (res) {
                        let resultOfLevel = res.rolesLevel.find(roles => roles._id === parseInt(inputLevel, 10))
                        const indexOfLevel = res.rolesLevel.findIndex(roles => roles._id === parseInt(inputLevel, 10))
                        if (resultOfLevel) {
                            const index2 = resultOfLevel.role.indexOf(roleData.id)
                            res.rolesLevel[indexOfLevel].role.splice(index2, 1)
                            res.save();
                            titleEmbed = `⚠ Role Reward`
                            descEmbed = `El rol: ${inputRole} se ha eliminado para el nivel: ${inputLevel}`
                            return simpleEmbedField(message, ee.checkcolor, null, titleEmbed, descEmbed)
                        } else {
                            descEmbed = '❌ No tengo registros de ese nivel'
                            simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                        }
                    } else {
                        titleEmbed = `⚠ No hay ningun registro de este server`
                        descEmbed = `Uso: \`${prefix}rolereward [remove/list] <Role> <Nivel>\`\n`
                        return simpleEmbedField(message, ee.wrongcolor, gm.shortTime, titleEmbed, descEmbed)
                    }

                })
            }

            const addRoleInLevel = async () => {
                if (isValid(args[0], args[1])) {
                    const errorValidation = isValid(args[0], args[1])
                    return simpleEmbedField(message, ee.color, gm.largeTime, errorValidation.titleEmbed, errorValidation.descEmbed)
                }
                roleData = await getRole(message, args[0])
                if (!roleData) {
                    descEmbed = '❌ No puede encontrar este rol, intenta de nuevo'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, descEmbed)
                }
                if (parseInt(args[1]) < 0) {
                    descEmbed = '❌ El nivel minimo debe ser mayor a 0'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.shortTime, descEmbed)
                }
                _settingsXP.findOne({ _id: guildID }, (err, res) => {
                    if (err) {
                        console.log(String(err.stack).bgRed);
                        errorMessageEmbed(err, message)
                    }
                    if (res) {
                        let resultOfLevel = res.rolesLevel.find(roles => roles._id === parseInt(args[1], 10))
                        const indexOfLevel = res.rolesLevel.findIndex(roles => roles._id === parseInt(args[1], 10))
                        if (resultOfLevel) {
                            resultOfLevel.role = [...new Set(resultOfLevel.role.concat([roleData.id]))]
                            res.rolesLevel[indexOfLevel] = resultOfLevel
                            res.rolesLevel.sort((sortA, sortB) => sortA._id > sortB._id ? 1 : (sortB._id > sortA._id ? -1 : 0))
                            res.save();
                        } else {
                            res.rolesLevel = res.rolesLevel.concat([{
                                _id: parseInt(args[1], 10),
                                role: [roleData.id]
                            }])
                            res.save()
                        }
                    } else {
                        const newData = new _settingsXP({
                            _id: guildID,
                            rolesLevel: [{
                                _id: parseInt(args[1], 10),
                                role: [roleData.id]
                            }]
                        })
                        newData.save();
                    }
                    titleEmbed = `⚠ Role Reward`
                    descEmbed = `El rol: ${args[0]} se asignara al nivel: ${args[1]}`
                    simpleEmbedField(message, ee.checkcolor, null, titleEmbed, descEmbed)
                })
            }

            const isValid = (argRole, argsLevel) => {
                if (!argRole || !argsLevel) {
                    return {
                        titleEmbed: '⚠ Por favor, dime que realizar hacer',
                        descEmbed: `Uso: \`${prefix}rolereward remove <Role> <Nivel>\``
                    }
                }
                if (!argRole.includes(`@&`)) {
                    return {
                        titleEmbed: '⚠ Role Rewards',
                        descEmbed: `Por favor escribe un rol valido`
                    }
                }
                if (!argRole) {
                    return {
                        titleEmbed: '⚠ Role Rewards',
                        descEmbed: `Por favor escribe el rol a asignar`
                    }
                }
                return false
            }

            switch (args[0]) {
                case "list":
                    listOfRolesAndLevels()
                    break;
                case "remove":
                    removeRoleInLevel(args[1], args[2])
                    break;

                default:
                    addRoleInLevel()
                    break;
            }

        } catch (e) {
            console.log(String(e.stack).bgRed)
            errorMessageEmbed(e, message)
        }
    },
}