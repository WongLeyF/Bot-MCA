const { MessageEmbed, WebhookClient } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
module.exports = {
  name: "Say",
  category: "☠️ Moderación",
  cooldown: 2,
  memberpermissions: ["VIEW_AUDIT_LOG"],
  usage: "say <texto>",
  description: "Reenvía el texto",
  run: async (client, message, args, user, text, prefix) => {
    try {
      if (!args[0])
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`:warning: ERROR | No pusiste ningún texto`)
          .setDescription(`uso: \`${prefix}say <Tu texto>\``)
        );
      message.channel.send(text);
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


