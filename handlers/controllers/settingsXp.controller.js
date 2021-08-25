const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");
const _settingsXp = require("../../models/settingsXP.model");
const { removeItemFromArr, simpleEmbedDescription, errorMessageEmbed } = require("../functions");

module.exports = {
  getlvlcooldown: async (message) => {
    const guildID = message.guild.id
    const result = _settingsXp.findOne({ _id: guildID });
    return result?.cooldown
  },

  getlvlsettings: async (message) => {
    const guildID = message.guild.id
    return _settingsXp.findOne({ _id: guildID });
  },

  findUpdateRoleLevels: (message, level) => {
    const query = {
      $and: [
        { _id: message.guild.id },
        {
          rolesLevel: {
            $elemMatch:
              { _id: parseInt(level, 10) }
          }
        }
      ]
    }
    _settingsXp.findOne(query, (err, res) => {
      if (err) {
        console.log(String(err.stack).bgRed);
        errorMessageEmbed(err, message)
      }
      if (res) {
        try {
          const index = res.rolesLevel.findIndex(roles => roles._id === parseInt(level, 10))
          if (index === -1) return;
          for (let i = 0; i < index; i++) {
            message.guild.members.cache.get(message.member.id).roles.remove(res.rolesLevel[i].role)
          }
          message.guild.members.cache.get(message.member.id).roles.set(res.rolesLevel[index].role);
        } catch (e) {
          errorMessageEmbed(e, message)
          return message.reply(new MessageEmbed()
            .setColor(ee.color)
            .setTitle("⚠ Info STATUS")
            .setDescription(`No pude asignar el rol`)
          ).then(msg => setTimeout(() => msg.delete(), 5000)).catch(e => console.log(gm.errorDeleteMessage.gray));
        }
      }
    })
  },

  noXpRoles: async (message, role, type) => {
    const guildID = message.guild.id
    let status = false
    _settingsXp.findOne({ _id: guildID }, (err, res) => {
      if (err) {
        console.log(String(err.stack).bgRed);
        errorMessageEmbed(err, message)
      }

      switch (type) {
        case 'add':
          if (res) {
            if (!res.noRoles.includes(role.id))
              res.noRoles.push(role.id)
            res.save()
            status = true
          } else {
            const newData = new _settingsXp({
              _id: guildID,
              noRoles: [role.id]
            })
            newData.save()
            status = true
          }
          break;
        case 'remove':
          if (res) {
            if (res.noRoles.includes(role.id)) {
              const newArray = removeItemFromArr(res.noRoles, role.id)
              res.noRoles = newArray
              res.save()
              status = true
            }
          }

          break;
        case 'list':
          if (res) {
            let options = []
            message.guild.roles.cache.filter(f => res.noRoles.includes(f.id)).map(m => {
              options.push({
                label: m.name,
                value: m.id,
                description: `Click para eliminar el role de ${message.guild.roles.cache.get(m.id).name}`,
                emoji: '📍'
              })
            });
            if (options.length === 0)
              return simpleEmbedDescription(message, 'RED', 10000, '❌ No encontre nada en la lista');
            if (options.length > 25) {
              let row = []
              const sliceLength = 25; // Partir en arreglo de 3
              for (let i = 0; i < options.length; i += sliceLength) {
                let slice = options.slice(i, i + sliceLength);
                row.push(slice);
              }
              let indexRow = 0
              const rows = row.map(op => new MessageActionRow().addComponents(
                new MessageSelectMenu()
                  .setCustomId(`norolexp ${indexRow++}`)
                  .setPlaceholder("Lista de roles que no reciben experiencia")
                  .addOptions(op)
              ))
              if (rows > 5) {
                const sliceLength = 5; // Partir en arreglo de 3
                for (let i = 0; i < rows.length; i += sliceLength) {
                  let slice = rows.slice(i, i + sliceLength);
                  message.channel.send({
                    embeds: [new MessageEmbed().setDescription('⚠️ **Roles que no reciben experiencia**').setColor("YELLOW")],
                    components: slice
                  })
                }
              } else {
                message.channel.send({
                  embeds: [new MessageEmbed().setDescription('⚠️ **Roles que no reciben experiencia**').setColor("YELLOW")],
                  components: rows
                })
              }
            } else {
              const row = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                  .setCustomId("norolexp")
                  .setPlaceholder("Lista de roles que no reciben experiencia")
                  .addOptions(options)
              )
              message.channel.send({
                embeds: [new MessageEmbed().setDescription('⚠️ **Roles que no reciben experiencia**').setColor("YELLOW")],
                components: [row]
              })
            }
            status = true
          } else return simpleEmbedDescription(message, 'RED', 10000, '❌ No encontre nada en la lista');
          break;
        case 'remove-all':
          res.noRoles = []
          res.save()
          status = true
          break;
      }
    });
    return status
  }
}