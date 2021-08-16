const { errorMessageEmbed, simpleEmbedDescription, simpleEmbedField } = require("../../handlers/functions")
const ee = require("../../json/embed.json");
const gm = require("../../json/globalMessages.json");
const settingsPrefixSchema = require('../../models/setting.model');


module.exports = {
  name: "setPrefix",
  aliases: ["sp", "prefix"],
  description: "Cambia el prefijo del Bot",
  category: "⚙ Configuración",
  cooldown: 10,
  memberpermissions: ["ADMINISTRATOR"],
  usage: "setprefix [Caracteres]",
  run: async (client, message, args, user, text, prefix) => {
    try {
      if (!args[0]) {
        const titleEmbed = `:warning: Por favor, especifica el canal`
        const descEmbed = `Uso: \`${prefix}setprefix [Caracter]\``
        return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
      }

      const guildID = message.guild.id
      settingsPrefixSchema.findOne({ _id: guildID }, (err, res) => {
        if (err) {
          console.log(String(err.stack).bgRed);
          errorMessageEmbed(err, message)
        } if (res) {
          res.prefix = args[0]
          res.save()
        } else {
          const newData = new settingsPrefixSchema({
            _id: guildID,
            prefix: args[0],
          });
          newData.save()
        }
        const descEmbed = `:white_check_mark: El prefijo para el bot ahora es: \`${args[0]}\` `
        simpleEmbedDescription(message, ee.color, null, descEmbed)
      });

    } catch (e) {
      console.log(String(e.stack).bgRed);
      errorMessageEmbed(e, message)
    }
  },
};