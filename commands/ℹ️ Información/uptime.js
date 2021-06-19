const { MessageEmbed, WebhookClient } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
const { duration } = require("../../handlers/functions")
module.exports = {
  name: "Uptime",
  category: "ℹ️ Información",
  cooldown: 10,
  usage: "uptime",
  description: "Te dice cuanto tiempo a estado online el bot",
  run: async (client, message, args, user, text, prefix) => {
    try {
      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`:white_check_mark: **${client.user.username}** is since:\n ${duration(client.uptime)} online`)
      );
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


