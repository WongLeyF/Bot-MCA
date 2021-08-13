const { MessageEmbed, Permissions } = require("discord.js");
const ee = require("../../json/embed.json");
const gm = require("../../json/globalMessages.json");
const { simpleEmbedField } = require("../../handlers/functions");

module.exports = {
  name: "Say",
  category: "☠️ Moderación",
  cooldown: 2,
  memberpermissions: [Permissions.FLAGS.VIEW_AUDIT_LOG],
  usage: "say <texto>",
  description: "Reenvía el texto",
  run: async (client, message, args, user, text, prefix) => {
    try {
      if (!args[0]) {
        const title = `:warning: No pusiste ningún texto`
        const desc = `Uso: \`${prefix}say <Tu texto>\``
        return simpleEmbedField(message, ee.wrongcolor, gm.longTime, title, desc)
      }
      message.channel.send({ content: text });
      message.delete()
    } catch (e) {
      console.log(String(e.stack).bgRed)
      errorMessageEmbed(e, message)
    }
  }
}


