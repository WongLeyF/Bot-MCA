const { MessageEmbed, WebhookClient } = require("discord.js")
const ee = require("../../botconfig/embed.json")
const gm = require("../../botconfig/globalMessages.json")
const { Database } = require("quickmongo");
const db = new Database(process.env.mongoPath);

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
            const guildID = message.guild.id
            let role
            if (args[0] == "list") {
                const rolerewardRaw = await db.get(`${message.guild.id}`)
                if (rolerewardRaw) {
                    let rrString = "", temp = ""
                    for (let i in rolerewardRaw) {
                        const rrObjects = await db.get(`${message.guild.id}.${i}`)
                        temp = rrObjects.filter(r => r.roleid != 0).map(r => String(`Nivel: ` + r.lvl + `\nRole: <@&` + r.roleid + `>\n\n`))
                        rrString += temp[0] != undefined ? temp[0] : ""
                    }
                    return message.channel.send(new MessageEmbed()
                        .setTitle("**Role Rewards**:")
                        .setDescription(`\n${rrString == "" ? "**No hay ningun role**" : rrString}`)
                    )
                } else return message.reply(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`⚠ No hay ningun registro de este server`)
                    .setDescription(`Uso: \`${prefix}rolereward [remove/list] <Role> <Nivel>\`\n`)
                ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
            }
            if (args[0] == "remove") {

                if (!args[1]) return message.reply(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`⚠ Por favor, dime que realizar hacer`)
                    .setDescription(`Uso: \`${prefix}rolereward remove <Role> <Nivel>\``)
                ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                if (!args[1].includes(`@&`)) return await message.reply(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle("⚠ Role Rewards")
                    .setDescription(`Por favor escribe un rol valido`)
                ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));

                if (args[1]) {
                    if (isNaN(args[1])) role = message.guild.roles.cache.find(role => role.name === args[1])
                    if (!isNaN(args[1])) role = message.guild.roles.cache.get(args[1].slice(3, -1));
                    if (role == undefined) role = message.guild.roles.cache.get(args[1].slice(3, -1))
                } else return await message.reply(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle("⚠ Role Rewards")
                    .setDescription(`Por favor escribe el rol a asignar`)
                ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                const data = await db.exists(`${guildID}.${args[2]}`)
                if (!role) return message.reply(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription('❌ No puede encontrar este rol, intenta de nuevo'));
                if (args[2] < 0) return message.reply(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription('❌ El nivel minimo debe ser mayor a 0')
                ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                if (data) {
                    const inputRolLVL = [{
                        lvl: args[2],
                        roleid: 0
                    }]
                    const rolLVL = await db.get(`${guildID}.${args[2]}`)
                    if (rolLVL.find(e => e.roleid == role) != undefined) {
                        Object.assign(rolLVL, inputRolLVL)
                        await db.set(`${guildID}.${args[2]}`, rolLVL).then(console.log);
                        return message.channel.send(new MessageEmbed()
                            .setColor(ee.checkcolor)
                            .setTitle("⚠ Role Reward")
                            .setDescription(`El rol: ${args[1]} se ha eliminado para el nivel: ${args[2]}`)
                        )
                    } else return message.channel.send(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription('❌ No tengo registros de ese rol con tal nivel')
                    ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                } else return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription('❌ No tengo registros de ese nivel')
                ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
                return
            }
            if (!args[0]) {
                return message.reply(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`⚠ Por favor, dime que realizar hacer`)
                    .setDescription(`Uso: \`${prefix}rolereward [remove/list] <Role> <Nivel>\``)
                ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));

            }
            if (!args[0].includes(`@&`)) return await message.reply(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle("⚠ Role Rewards")
                .setDescription(`Por favor escribe un rol valido`)
            ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));

            if (args[0]) {
                if (isNaN(args[0])) role = message.guild.roles.cache.find(role => role.name === args[0])
                if (!isNaN(args[0])) role = message.guild.roles.cache.get(args[0].slice(3, -1));
                if (role == undefined) role = message.guild.roles.cache.get(args[0].slice(3, -1))
            } else return await message.reply(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle("⚠ Role Rewards")
                .setDescription(`Por favor escribe el rol a asignar`)
            ).then(msg => msg.delete({ timeout: 30000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
            const data = await db.exists(`${guildID}.${args[1]}`)
            if (!role) return message.reply(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription('❌ No puede encontrar este rol, intenta de nuevo'));
            // message.member.guild.roles.add(role);

            if (!args[1]) return message.reply(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription('❌ El nivel minimo debe ser mayor a 0')
            ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
            if (args[1] < 0) return message.reply(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription('❌ El nivel minimo debe ser mayor a 0')
            ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
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
            message.channel.send(new MessageEmbed()
                .setColor(ee.checkcolor)
                .setTitle("⚠ Role Reward")
                .setDescription(`El rol: ${args[0]} se asignara al nivel: ${args[1]}`)
            )


        } catch (e) {
            console.log(String(e.stack).bgRed)
            const webhookClient = new WebhookClient(process.env.webhookID, process.env.webhookToken);
            const embed = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(gm.titleError)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
            await webhookClient.send('Webhook Error', {
                username: message.guild.name,
                avatarURL: message.guild.iconURL({ dynamic: true }),
                embeds: [embed],
            });
        }
    },
}