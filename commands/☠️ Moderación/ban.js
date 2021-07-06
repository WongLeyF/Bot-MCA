const { MessageEmbed } = require("discord.js");
const { errorMessageEmbed, simpleEmbedField, simpleEmbedDescription } = require("../../handlers/functions")
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
module.exports = {
    name: "Ban",
    description: "Banear miembros del servidor",
    category: "☠️ Moderación",
    cooldown: 2,
    memberpermissions: ["BAN_MEMBERS"],
    usage: "ban <Tag/ID> [Razón de expulsión]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) {
                const title = `❌ Por favor, especifica al usuario`
                const desc = `Uso: \`${prefix}ban <Tag/ID> [Razón]\``
                return simpleEmbedField(message, ee.wrongcolor, gm.longTime, title, desc)
            }
            if (member.id === message.author.id) {
                const desc = '❌ Estem, no puedes banearte a ti mismo...'
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc)
            }
            if (!member.bannable) {
                const desc = '❌ No puedo banear a este usuario. Ya que es mod/admin o tiene un rol mas alto que el mio'
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc)
            }
            let reason = !args.slice(1).join(" ") ? 'Sin especificar' : args.slice(1).join(" ");
            await member.ban({ reason: reason })

            message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setTitle('Miembro Baneado')
                .setThumbnail(member.user.displayAvatarURL())
                .addField('Usuario Baneado', member, true)
                .addField('ID', member.id, true)
                .addField('Baneado por', message.author)
                .addField('Razon', reason)
                .setImage('https://media1.tenor.com/images/0be06cf168b1fa90572791419407f679/tenor.gif')
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
            );
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errorMessageEmbed(e, message)
        }
    }
};