const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
module.exports = {
    name: "Say",
    category: "☠️ Moderación",  
    cooldown: 2,
    memberpermissions:["VIEW_AUDIT_LOG"],
    usage: "say <texto>",
    description: "Reenvía el texto",
    run: async (client, message, args, user, text, prefix) => {
    try{
      if(!args[0])
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`:warning: ERROR | No pusiste ningún texto`)
            .setDescription(`uso: \`${prefix}say <Tu texto>\``)
        );
      message.channel.send(text);
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
}


