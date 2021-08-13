const { MessageEmbed, Permissions } = require("discord.js");
const ee = require("../../json/embed.json");
const gm = require("../../json/globalMessages.json");
const { errorMessageEmbed, simpleEmbedField } = require("../../handlers/functions")
module.exports = {
  name: "Embed",
  category: "☠️ Moderación",
  aliases: ["say-embed"],
  cooldown: 2,
  usage: "embed <Título> && <Descripción>",
  memberpermissions: [Permissions.FLAGS.VIEW_AUDIT_LOG],
  description: "Reenvía un mensaje enforma de Embed",
  run: async (client, message, args, user, text, prefix) => {
    try {
      if (!args[0]) {
        const titleEmbed = `:warning: No colocaste un título o una descripción`,
          descEmbed = `Uso: \`${prefix}embed <Título> && <Descripción>\``
        return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
      }

      const userargs = args.join(" ").split("&&");
      const title = userargs[0];
      const desc = userargs.slice(1).join(" ")

      if (title.length > 256 | desc.length > 256) {
        const titleEmbed = `:warning: No puedes poner mas de 256 caracteres`,
          descEmbed = `Uso: \`${prefix}embed <Título> && <Descripción>\``
        return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
      }

      message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(ee.color)
          .setFooter(message.author.tag, message.author.avatarURL({ dynamic: false, format: 'png' }))
          .setTitle(title ? title : "")
          .setDescription(desc ? desc : "")
        ]
      })
      message.delete()
    } catch (e) {
      console.log(String(e.stack).bgRed)
      errorMessageEmbed(e, message)
    }
  }
}