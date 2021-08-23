const { MessageEmbed } = require("discord.js");
const { errorMessageEmbed } = require("../../handlers/functions")
const ee = require("../../json/embed.json");
module.exports = {
  name: "Ping",
  category: "ℹ️ Información",
  aliases: ["latency"],
  cooldown: 2,
  usage: "ping",
  description: "Te muestra el tiempo de respuesta de " + ee.footertext,
  run: async (client, message, args, user, text, prefix) => {
    try {
      message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`🏓 Pinging....`)
        ]
      }).then(msg => {
        msg.edit({
          embeds: [new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`🏓 Ping es \`${Math.round(client.ws.ping)}ms\``)
          ]
        });
      })
    } catch (e) {
      console.log(String(e.stack).bgRed)
      errorMessageEmbed(e, message)
    }
  }
}

