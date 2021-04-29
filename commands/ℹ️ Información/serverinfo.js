const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
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
      let {guild} = message
      message.channel.send(
        new MessageEmbed()
          .setColor(ee.color)
          .setTitle("Informacion del servidor"+" '"+guild.name+"'")
          .setThumbnail(guild.iconURL())
          .addField("Descripción", guild.description)
          .addField("Region", guild.region,true)
          .addField("Miembros", guild.memberCount,true)
          .setFooter("Dueño: " + guild.owner.user.tag)
      );
    } catch (e) {
      console.log(String(e.stack).bgRed);
      return message.channel.send(
        new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(gm.titleError)
          .setDescription(`\`\`\`${e.stack}\`\`\``)
      );
    }
  },
};
