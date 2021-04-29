const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
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
            if(!args[0]) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`:warning: | Por favor, especifica al usuario`)
                .setDescription(`Uso: \`${prefix}kick <Tag/ID> [Razón]\``)
            ).then(msg=>msg.delete({timeout: 10000}).catch(e=>console.log(gm.errorDeleteMessage.gray)));
            if(!member) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription('❌ No pude encontrar a este usuario')
            ).then(msg=>msg.delete({timeout: 10000}).catch(e=>console.log(gm.errorDeleteMessage.gray)));
            if(!member.kickable) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription('❌ No puedo expulsar a este usuario. Ya que es mod/admin o tiene un rol mas alto que el mio')
            ).then(msg=>msg.delete({timeout: 10000}).catch(e=>console.log(gm.errorDeleteMessage.gray)));
            if(member.id === message.author.id) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription('❌ Estem, no puedes expulsarte a ti mismo...')
            ).then(msg=>msg.delete({timeout: 10000}).catch(e=>console.log(gm.errorDeleteMessage.gray)));
            let reason = args.slice(1).join(" ")
            reason = reason.length===0 ? 'Sin especificar': reason;
            await member.ban({reason: reason})
            
            message.channel.send( new MessageEmbed()
            .setColor(ee.color)
            .setTitle('Miembro Expulsado')
            .setThumbnail(member.user.displayAvatarURL())
            .addField('Usuario expulsado', member, true)
            .addField('ID', member.id, true)
            .addField('Expulsado por', message.author)
            .addField('Razon', reason)
            .setImage('https://media1.tenor.com/images/0be06cf168b1fa90572791419407f679/tenor.gif')
            .setFooter(ee.footertext, ee.footericon)
            .setTimestamp()
            );
        } catch (e) {
            console.log(String(e.stack).bgRed)
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(gm.titleError)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
            );
        }
    }
};