const { MessageEmbed } = require("discord.js")
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
            if (!args[0] || !options.includes(args[0])) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`⚠ Por favor, dime que realizar hacer`)
                .setDescription(`Uso: \`${prefix}setlevel <add/set/sub> <mencion/ID> <nivel>\``))
            if (!args[1]) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`⚠ Por favor, especifica al usuario`)
            ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
            if (!member) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`⚠ Por favor, especifica un usuario valido`)
            ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
            if (!args[2]) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`⚠ Por favor, especifica el nivel`)
            ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
            if (isNaN(args[2])) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`⚠ Por favor, escribe un numero valido para el nivel`)
            ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));

            switch (args[0]) {
                case 'add':

                    if (await Levels.appendLevel(member.id, message.guild.id, args[2])) return message.channel.send(new MessageEmbed()
                        .setColor(ee.color)
                        .setDescription(`Se agregaron a ${member} estos niveles: ${args[2]}`)
                    )
                    break;

                case 'set':
                    if (await Levels.setLevel(member.id, message.guild.id, args[2])) return message.channel.send(new MessageEmbed()
                        .setColor(ee.color)
                        .setDescription(`El nuevo nivel de ${member} es: ${args[2]}`)
                    )
                    break;

                case 'sub':
                    if (await Levels.subtractLevel(member.id, message.guild.id, args[2])) return message.channel.send(new MessageEmbed()
                        .setColor(ee.color)
                        .setDescription(`Se restaron a ${member} estos niveles: ${args[2]}`)
                    )
                    break;

                default:
                    return message.channel.send(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(`⚠ Por favor, dime que realizar hacer, \`${args[0]}\` no lo reconozco como accion`)
                        .setDescription(`Uso: \`${prefix}setlevel <add/set/sub> <mencion/ID> <nivel>\``))
            }
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