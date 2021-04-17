const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
module.exports = {
    name: "unban",
    aliases: [""],
    description: "Desbanear miembros del servidor",
    category: "☠️ Moderación",
    cooldown: 2,
    memberpermissions:["BAN_MEMBERS"],
    usage: "unban <ID> [Razón de expulsión]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const toUnban = await client.users.fetch(args[0])
            let reason = args.slice(1).join(" ")
            reason = reason.length===0 ? 'Sin especificar': reason;
            await message.guild.members.unban(toUnban, reason)     
            message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setDescription(`✅ **${toUnban}** ha sido desbaneado del server!`)
            ).then(msg=>msg.delete({timeout: 15000}).catch(e=>console.log(gm.errorDeleteMessage.gray)));
        } catch (e) {
            let errMs= (e.code === Discord.Constants.APIErrors.UNKNOWN_USER ? 
            'Usuario no encontrado o no existe': e.code === Discord.Constants.APIErrors.UNKNOWN_BAN ? 
            'Este usuario no esta en la lista de baneados' :e.code=== 50035? 'No se puede desbanear':`\`\`\`${e.stack}\`\`\``)
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`:warning: | Algo salió mal`)
                .setDescription(errMs)
            ).then(msg=>msg.delete({timeout: 15000}).catch(e=>console.log(gm.errorDeleteMessage.gray)));;
        }
    }
};
