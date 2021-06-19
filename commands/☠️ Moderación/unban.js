const { MessageEmbed, WebhookClient } = require("discord.js");
const Discord = require("discord.js");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
module.exports = {
    name: "Unban",
    description: "Desbanear miembros del servidor",
    category: "☠️ Moderación",
    cooldown: 2,
    memberpermissions: ["BAN_MEMBERS"],
    usage: "unban <ID> [Razón de expulsión]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            if (!args[0]) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`:warning: | Por favor, especifica al usuario`)
                .setDescription(`Uso: \`${prefix}unban <Tag/ID> [Razón]\``)
            ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
            const toUnban = await client.users.fetch(args[0])
            let reason = !args.slice(1).join(" ") ? 'Sin especificar' : args.slice(1).join(" ");
            await message.guild.members.unban(toUnban, reason)
            message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setDescription(`✅ **${toUnban}** ha sido desbaneado del server!`)
            ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
        } catch (e) {
            let errMs = (e.code === Discord.Constants.APIErrors.UNKNOWN_USER ?
                'Usuario no encontrado o no existe' : e.code === Discord.Constants.APIErrors.UNKNOWN_BAN ?
                    'Este usuario no esta en la lista de baneados' : e.code === 50035 ? 'No se puede desbanear' : `\`\`\`${e.stack}\`\`\``)
            if (errMs != e.stack)
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`:warning: | Algo salió mal`)
                    .setDescription(errMs)
                ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
            else {
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
        }
    }
};
