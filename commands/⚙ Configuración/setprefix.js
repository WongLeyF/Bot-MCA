const { MessageEmbed } = require("discord.js");
const { errorMessageEmbed, simpleEmbedDescription } = require("../../handlers/functions")
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
      
      if (!args[0]) {
        const descEmbed = '❌ Dame un carácter para el prefijo'
        return simpleEmbedDescription( message, ee.wrongcolor, gm.shortTime, descEmbed)
      }
      
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
      
      const descEmbed = `:white_check_mark: El prefijo para el bot ahora es: \`${args[0]}\` `
      simpleEmbedDescription(message, ee.color, null, descEmbed)

    } catch (e) {
      console.log(String(e.stack).bgRed);
      errorMessageEmbed(e, message)
    }
  },
};