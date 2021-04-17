const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "embed",
    category: "☠️ Moderación",
    aliases: ["say-embed"],
    cooldown: 2,
    usage: "embed <Título> $$ <Descripción>",
    description: "Reenvía un mensaje de un como Embed",
    run: async (client, message, args, user, text, prefix) => {
    try{
      if(!args[0])
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`:warning: ERROR | No colocaste un título o una descripción`)
            .setDescription(`Uso: \`${prefix}embed <Título> $$ <Descripción>\``)
        );
      let userargs = args.join(" ").split("$$");
      let title = userargs[0];
      let desc = userargs.slice(1).join(" ")
      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(title ? title : "")
        .setDescription(desc ? desc : "")
      )
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`:warning: ERROR | Algo salió mal`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
    }
  }
}