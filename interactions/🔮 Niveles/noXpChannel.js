const { MessageEmbed } = require("discord.js");
const { removeItemFromArr, errorMessageEmbed } = require("../../handlers/functions");
const _settingsXP = require("../../models/settingsXP.model")


module.exports = {
    name: "noXpChannel",
    memberpermissions: ["MANAGE_ROLES"],
    run: async (client, interaction, args) => {

        const guildID = interaction.guild.id
        const command = client.commands.get('noxpchannel')
        const channel = client.channels.cache.get(interaction.values[0])
        _settingsXP.findOne({ _id: guildID }, (err, res) => {
            if (err) {
                console.log(String(err.stack).bgRed);
                errorMessageEmbed(err, interaction)
            }
            if (res) {
                res.noChannels = removeItemFromArr(res.noChannels, channel.id)
                res.save().then(() => {
                    interaction.reply({
                        embeds: [new MessageEmbed({
                            description: `Acabo de eliminar el role ${channel} de la lista!`,
                            color: "YELLOW"
                        })],
                        ephemeral: true
                    });
                    interaction.message.delete()
                    command.run(client, interaction, ['list'])
                });
            }
        })
    }
}