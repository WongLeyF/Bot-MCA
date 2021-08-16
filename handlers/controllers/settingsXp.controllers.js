const _settingsXp = require("../../models/settingsXP.model");
const { removeItemFromArr, simpleEmbedDescription } = require("../functions");

module.exports = {
  getlvlcooldown: async (message) => {
    const guildID = message.guild.id
    _settingsXp.findOne({ _id: guildID }, (err, res) => {
      if (res) {
        return data ? data.cooldown : null

      }
    });
    return;
  },
  getlvlsettings: async (message) => {
    const guildID = message.guild.id
    _settingsXp.findOne({ _id: guildID }, (err, res) => {
      if (res) {
        return data ? data : null

      }
    });
    return;
  },

  noXpRoles: async (message, role, type) => {
    const guildID = message.guild.id
    let status = false
    _settingsXp.findOne({ _id: guildID }, (err, res) => {

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
            // let options = new Widgets.MenuRolesXP.dropdownroles()
            message.guild.roles.cache.filter(f => res.noRoles.includes(f.id)).map(m => {
              options.addrole({
                label: m.name,
                role: m.id,
                emoji: '📍'
              })
            });
            if (options.roles.length === 0)
              return simpleEmbedDescription(message, 'RED', 10000, '❌ No encontre nada en la lista');
            // Widgets.MenuRolesXP.dropdownroles.create({
            //   message: message,
            //   role: options, /*dropdownroles constructor*/
            //   content: new MessageEmbed().setDescription('⚠️ **Roles que no reciben experiencia**').setColor("YELLOW"),
            //   channelID: message.channel.id
            // });
            status = true
          } else return simpleEmbedDescription(message, 'RED', 10000, '❌ No encontre nada en la lista');
          break;
        case 'remove-all':
          const newArray = []
          res.noRoles = newArray
          res.save()
          status = true
          break;
      }
    });
    return status
  }
}