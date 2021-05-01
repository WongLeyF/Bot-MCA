const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");

const channelPollID = ['831738824639905812',]

module.exports = {
name: "Poll",
aliases: ["encuesta", "sug"],
description: "Agrega automáticamente reacciones para votar al último mensaje enviado o al mensaje con el ID asignado.",
category: "🧰 Utilidades",
cooldown: 5,
usage: "poll [ID del mensaje]",
run: async (client, message, args, user, text, prefix) => {
    try {
        let fetched
        await message.delete()
        if (args.length===0) {
            fetched = await message.channel.messages.fetch({limit: 1})
        } else {
            fetched = await message.channel.messages.fetch(args[0])
        }
        const addReactions = (message) => {message.react('✔')
            setTimeout(() => {
                message.react('❌')
            },750)
        }
        if (args.length!==0) {
            addReactions(fetched)
        }else{
            if(fetched && fetched.first()) addReactions(fetched.first())
        }
        
        //if (channelPollID.includes(message.channel.id)) addReactions(message)
    } catch (e) {
        if (e.code=== 50035) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription("❌ Necesitas darme un ID de mensaje")
            ).then(msg=>msg.delete({timeout: 10000}).catch(e=>console.log(gm.errorDeleteMessage.gray)));
        if (e.code=== 10008) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription("❌ No pude reconocer ese ID, ¿Seguro que es del mensaje?")
            ).then(msg=>msg.delete({timeout: 10000}).catch(e=>console.log(gm.errorDeleteMessage.gray)));
        console.log(String(e.stack).bgRed);
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(gm.titleError)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
         );
        }
    },
};