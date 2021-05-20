const { MessageEmbed } = require("discord.js")
const ee = require("../../botconfig/embed.json")
const gm = require("../../botconfig/globalMessages.json")
const { Database } = require("quickmongo");
const db = new Database(process.env.mongoPath);

module.exports = {
    name: "RoleReward",
    aliases: ["rr"],
    description: "Asigna un rol para un nivel en especifico",
    category: "🔮 Niveles",
    cooldown: 2,
    memberpermissions: ["MANAGE_ROLES"],
    usage: "rolereward <Role> <Nivel>",
    run: async (client, message, args, user, text, prefix) => {
        try {

            const guildID = message.guild.id
            let role

            if (args[0].slice(0, -args[0].length + 1) == `@`) return await message.reply(new MessageEmbed()
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
            console.log(role)
            const data = await db.exists(`${guildID}.${args[1]}`)
            if (!role) return message.reply(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription('❌ No puede encontrar este rol, intenta de nuevo'));
            // message.member.guild.roles.add(role);

            if (isNaN(args[1]) || isNaN(args[1])) return message.reply(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription('❌ No puedo asignar esto, asigna un nivel')
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
                .setTitle("⚠ Rango de experiencia por mensaje")
                .setDescription(`La experiencia minima es: ${args[0]}\nLa experiencia maxima es: ${args[1]}`)
            )


        } catch (e) {
            console.log(String(e.stack).bgRed)
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(gm.titleError)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
            )
        }
    },
}