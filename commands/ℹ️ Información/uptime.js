const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
const { duration } = require("../../handlers/functions")
module.exports = {
    name: "uptime",
    category: "ℹ️ Información",
    aliases: [""],
    cooldown: 10,
    usage: "uptime",
    description: "Te dice cuanto tiempo a estado online el bot",
    run: async (client, message, args, user, text, prefix) => {
    try{
      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`:white_check_mark: **${client.user.username}** is since:\n ${duration(client.uptime)} online`)
      );
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(gm.titleError)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
    }
  }
}


