const { MessageEmbed } = require("discord.js");
const { getRole } = require("../../handlers/functions");
const _settingsXP = require("../../models/settingsXP.model")


module.exports = {
    name: "roleReward",
    memberpermissions: ["MANAGE_ROLES"],
    run: async (client, interaction, args) => {

        const guildID = interaction.guild.id
        const command = client.commands.get('rolereward')
        const role = await getRole(interaction, interaction.values[0])
        _settingsXP.findOne({ _id: guildID }, (err, res) => {
            if (err) {
                console.log(String(err.stack).bgRed);
                errorMessageEmbed(err, interaction)
            }
            if (res) {
                const indexOfRole = res.rolesLevel[args[0]].role.indexOf(role.id)
                res.rolesLevel[args[0]].role.splice(indexOfRole, 1)
                res.save().then(() => {
                    interaction.reply({
                        embeds: [new MessageEmbed({
                            description: `Acabo de eliminar el role ${role} de la lista!`,
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