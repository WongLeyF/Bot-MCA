const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
const { simpleEmbedField } = require("../../handlers/functions");

module.exports = {
  name: "Say",
  category: "☠️ Moderación",
  cooldown: 2,
  memberpermissions: ["VIEW_AUDIT_LOG"],
  usage: "say <texto>",
  description: "Reenvía el texto",
  run: async (client, message, args, user, text, prefix) => {
    try {
      if (!args[0]) {
        const title = `:warning: No pusiste ningún texto`
        const desc = `Uso: \`${prefix}say <Tu texto>\``
        return simpleEmbedField(message, ee.wrongcolor, gm.longTime, title, desc)
      }
      message.channel.send(text);
      message.delete()
    } catch (e) {
      console.log(String(e.stack).bgRed)
      errorMessageEmbed(e, message)
    }
  }
}


