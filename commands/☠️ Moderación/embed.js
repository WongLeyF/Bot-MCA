const { MessageEmbed, WebhookClient } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
module.exports = {
  name: "Embed",
  category: "☠️ Moderación",
  aliases: ["say-embed"],
  cooldown: 2,
  usage: "embed <Título> && <Descripción>",
  memberpermissions: ["VIEW_AUDIT_LOG"],
  description: "Reenvía un mensaje enforma de Embed",
  run: async (client, message, args, user, text, prefix) => {
    try {
      if (!args[0])
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`:warning: | No colocaste un título o una descripción`)
          .setDescription(`Uso: \`${prefix}embed <Título> && <Descripción>\``)
        ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));

      let userargs = args.join(" ").split("&&");
      let title = userargs[0];
      let desc = userargs.slice(1).join(" ")
      if (title.length > 256 | desc.length > 256)
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`:warning: | No puedes poner mas de 256 caracteres`)
          .setDescription(`Uso: \`${prefix}embed <Título> && <Descripción>\``)
        ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(title ? title : "")
        .setDescription(desc ? desc : "")
      )
      message.delete()
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
  }
}