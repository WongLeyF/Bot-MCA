const { MessageEmbed, WebhookClient } = require("discord.js")
const ee = require("../../botconfig/embed.json")
const gm = require("../../botconfig/globalMessages.json")
const Levels = require("discord-xp");

module.exports = {
    name: "setXP",
    description: "Permite establecer, agregar o quitar experiencia\nadd = Agrega cierta cantidad de experiencia a los actuales\n set = Establece una cantidad de xp en especifica\nsub = Quita una cantidad de experiencia",
    category: "🔮 Niveles",
    cooldown: 2,
    memberpermissions: ["ADMINISTRATOR"],
    usage: "setxp <add/set/sub> <mencion/ID> <nivel>",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const options = ["add", "set", "sub"]
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            if (!args[0] || !options.includes(args[0])) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`⚠ Por favor, dime que realizar hacer`)
                .setDescription(`Uso: \`${prefix}setxp <add/set/sub> <mencion/ID> <nivel>\``))
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
                .setTitle(`⚠ Por favor, especifica la cantidad de experiencia`)
            ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
            if (isNaN(args[2])) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`⚠ Por favor, especifica una cantidad de experiencia valida`)
            ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));

            switch (args[0]) {
                case 'add':

                    if (await Levels.appendXp(member.id, message.guild.id, args[2])) return message.channel.send(new MessageEmbed()
                        .setColor(ee.color)
                        .setDescription(`Se agregaron a ${member} esta cantidad de xp: ${args[2]}`)
                    )
                    break;

                case 'set':
                    if (await Levels.setXp(member.id, message.guild.id, args[2])) return message.channel.send(new MessageEmbed()
                        .setColor(ee.color)
                        .setDescription(`La nueva experiencia de ${member} es: ${args[2]}`)
                    )
                    break;

                case 'sub':
                    if (await Levels.subtractXp(member.id, message.guild.id, args[2])) return message.channel.send(new MessageEmbed()
                        .setColor(ee.color)
                        .setDescription(`Se restaron a ${member} esta cantidad de xp: ${args[2]}`)
                    )
                    break;

                default:
                    return message.channel.send(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(`⚠ Por favor, dime que realizar hacer, \`${args[0]}\` no lo reconozco como accion`)
                        .setDescription(`Uso: \`${prefix}setxp <add/set/sub> <mencion/ID> <nivel>\``))
            }
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