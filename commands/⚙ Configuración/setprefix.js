const { MessageEmbed, WebhookClient } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");
const mongo = require('../../handlers/mongo')
const settingsPrefixSchema = require('../../models/setting_schema')

module.exports = {
  name: "setPrefix",
  aliases: ["sp", "prefix"],
  description: "Cambia el prefijo del Bot",
  category: "⚙ Configuración",
  cooldown: 15,
  memberpermissions: ["ADMINISTRATOR"],
  usage: "setprefix [Caracter]",
  run: async (client, message, args, user, text, prefix) => {
    try {
      if (!args[0]) return message.reply(new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription('❌ Dame un carácter para el prefijo ')
      ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
      await mongo().then(async mongoose => {
        try {
          const guildID = message.guild.id
          let dataPrefix = await settingsPrefixSchema.findOne({ _id: guildID });
          if (dataPrefix) {
            dataPrefix.prefix = args[0]
            await dataPrefix.save()
          } else {
            let newData = new settingsPrefixSchema({
              _id: guildID,
              prefix: args[0],
            });
            await newData.save()
          }
        } finally {
          mongoose.connection.close()
        }
      })
      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setDescription(`:white_check_mark: El prefijo para el bot ahora es: \`${args[0]}\` `)
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