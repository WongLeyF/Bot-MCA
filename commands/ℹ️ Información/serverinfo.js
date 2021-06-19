const { MessageEmbed, WebhookClient } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");

module.exports = {
  name: "Serverinfo",
  aliases: ["si"],
  description: "description",
  category: "ℹ️ Información",
  cooldown: 10,
  usage: "serverinfo",
  run: async (client, message, args, user, text, prefix) => {
    try {
      let { guild } = message
      let verLVL = guild.verificationLevel
      verLVL = verLVL == "VERY_HIGH" ? "Muy Alto" : verLVL == "HIGH" ? "Alto" : verLVL == "MEDIUM" ? "Medio" : verLVL == "LOW" ? "Bajo" : "Ninguno"
      const ruleChannel = guild.rulesChannelID ? "<#" + guild.rulesChannelID + ">" : "Ninguno"
      message.channel.send(
        new MessageEmbed()
          .setColor(ee.color)
          .setAuthor("Informacion del servidor" + " '" + guild.name + "'", guild.iconURL({ dynamic: true }))
          .setImage(guild.bannerURL({ size: 1024 }))
          .addField("Canal de Reglas", ruleChannel)
          .addField("Mejoras del servidor", "Nivel: " + guild.premiumTier + " | Mejoras: " + guild.premiumSubscriptionCount, true)
          .addField("Miembros", guild.memberCount, true)
          .addField("Nivel de verificacion", verLVL, true)
          .setFooter("Region: " + guild.region)
      );
    } catch (e) {
      console.log(String(e.stack).bgRed);
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
  },
};
