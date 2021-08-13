const _settingsXp = require("../../models/settingsXP.model");
const { removeItemFromArr, simpleEmbedDescription } = require("../functions");
const mongo = require("../mongo/mongo");

module.exports = {
  getlvlcooldown: async (message) => {
    const guildID = message.guild.id
    await mongo().then(async (mongoose) => {
      try {
        let data = await _settingsXp.findOne({ _id: guildID });
        lvlsettings = data ? data.cooldown : null
      } finally {
        mongoose.connection.close;
      }
    });
    return lvlsettings
  },
  getlvlsettings: async (message) => {
    const guildID = message.guild.id
    await mongo().then(async (mongoose) => {
      try {
        let data = await _settingsXp.findOne({ _id: guildID });
        lvlsettings = data ? data : null
      } finally {
        mongoose.connection.close;
      }
    });
    return lvlsettings
  },
  noXpRoles: async (message, role, type) => {
    const guildID = message.guild.id
    let status = false
    await mongo().then(async (mongoose) => {
      try {
        let data = await _settingsXp.findOne({ _id: guildID });
        switch (type) {
          case 'add':
            if (data) {
              if (!data.noRoles.includes(role.id))
                data.noRoles.push(role.id)
              await data.save()
              status = true
            } else {
              const newData = new _settingsXp({
                _id: guildID,
                noRoles: [role.id]
              })
              await newData.save()
              status = true
            }
            break;
          case 'remove':
            if (data) {
              if (data.noRoles.includes(role.id)) {
                const newArray = removeItemFromArr(data.noRoles, role.id)
                data.noRoles = newArray
                await data.save()
                status = true
              }
            }

            break;
          case 'list':
            if (data) {
              // let options = new Widgets.MenuRolesXP.dropdownroles()
              await message.guild.roles.cache.filter(f => data.noRoles.includes(f.id)).map(m => {
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
            data.noRoles = newArray
            await data.save()
            status = true
            break;
        }
      } finally {
        mongoose.connection.close;
      }
    });
    return status
  }
}