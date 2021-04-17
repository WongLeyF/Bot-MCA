const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");

module.exports = {
    name: "clear",
    aliases: ["purge"],
    description: "Borrar mensajes",
    category: "☠️ Moderación",
    cooldown: 2,
    memberpermissions:["MANAGE_MESSAGES"],
    usage: "clear <# de mensajes>",
    run: async (client, message, args, user, text, prefix) => {
        try{
            const amount = args[0]
            if(!amount) return message.reply(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription('❌ Necesitas darme un numero de mensajes a eliminar')
                ).then(msg=>msg.delete({timeout: 10000}).catch(e=>console.log(gm.errorDeleteMessage.gray)));
            if(amount <= 1) return message.reply(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`❌ Necesitas borrar mas de un mensaje`)
                ).then(msg=>msg.delete({timeout: 10000}).catch(e=>console.log(gm.errorDeleteMessage.gray)));
            if(amount >= 100){
                let aux,messageTodelete=amount            
                do {
                    aux= messageTodelete>=100 ? 100 : (parseInt(messageTodelete)+1)
                    await message.channel.messages.fetch({limit: aux}).then(messages => {
                        message.channel.bulkDelete(messages)
                        messageTodelete=messageTodelete-100
                    })
                } while (messageTodelete>0);
            }else{
                await message.channel.messages.fetch({limit: parseInt(amount)+1}).then(messages => {
                    message.channel.bulkDelete(messages)
                })
            } 
            message.channel.send(`:white_check_mark: Se han borrado ${amount} mensajes`
            ).then(msg=>msg.delete({timeout: 5000}).catch(e=>console.log(gm.errorDeleteMessage.gray)));
        } catch (e) {
            if (e.code=== 50035) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription("❌ Necesitas darme un numero de mensajes a eliminar")
            ).then(msg=>msg.delete({timeout: 10000}).catch(e=>console.log(gm.errorDeleteMessage.gray)));
            console.log(String(e.stack).bgRed)
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(gm.titleError)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
            ).then(msg=>msg.delete({timeout: 10000}).catch(e=>console.log(gm.errorDeleteMessage.gray)));
        }       
    }
};