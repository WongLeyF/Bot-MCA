const { MessageEmbed } = require("discord.js");
const ee = require("../../json/embed.json");
const { duration, errorMessageEmbed } = require("../../handlers/functions")
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
      errorMessageEmbed(e, message)
    }
  }
}


