const { MessageEmbed, WebhookClient } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
module.exports = {
  name: "Ping",
  category: "ℹ️ Información",
  aliases: ["latency"],
  cooldown: 2,
  usage: "ping",
  description: "Te muestra el tiempo de respuesta de " + ee.footertext,
  run: async (client, message, args, user, text, prefix) => {
    try {
      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`🏓 Pinging....`)
      ).then(msg => {
        msg.edit(new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`🏓 Ping es \`${Math.round(client.ws.ping)}ms\``)
        );
      })
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

