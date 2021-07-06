const { MessageEmbed } = require("discord.js");
const { errorMessageEmbed, simpleEmbedField, simpleEmbedDescription } = require("../../handlers/functions")
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");

module.exports = {
    name: "Kick",
    description: "Expulsar miembros del servidor",
    category: "☠️ Moderación",
    cooldown: 2,
    memberpermissions: ["KICK_MEMBERS"],
    usage: "kick <Tag/ID> [Razón de expulsión]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            
            let titleEmbed = `❌ Por favor, especifica al usuario`, 
                descEmbed = `Uso: \`${prefix}kick <Tag/ID> [Razón]\``

            if (!member){
                return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
            }
            if (member.id === message.author.id){
                descEmbed = '❌ Estem, no puedes expulsarte a ti mismo...'
                return simpleEmbedDescription(message, gm.wrongcolor, gm.longTime, descEmbed)
            } 
            if (!member.kickable) {
                descEmbed = '❌ No puedo expulsar a este usuario. Ya que es mod/admin o tiene un rol mas alto que el mio'
                return simpleEmbedDescription( message, ee.wrongcolor,gm.longTime, descEmbed)
            }

            let reason = !args.slice(1).join(" ") ? 'Sin especificar' : args.slice(1).join(" ");
            await member.kick( reason )
            message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setTitle('Miembro Expulsado')
                .setThumbnail(member.user.displayAvatarURL())
                .addField('Usuario expulsado', member, true)
                .addField('ID', member.id, true)
                .addField('Expulsado por', message.author)
                .addField('Razon', reason)
                .setImage('https://media1.tenor.com/images/ca1bad80a757fa8b87dacd9c051f2670/tenor.gif')
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
            );
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errorMessageEmbed(e, message)
        }
    }
};