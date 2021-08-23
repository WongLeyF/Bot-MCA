const { MessageEmbed } = require("discord.js");
const { noXpRoles } = require("../../handlers/controllers/settingsXp.controller");
const { getRole, delay } = require("../../handlers/functions");

module.exports = {
    name: "noRoleXp",
    memberpermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    run: async (client, interaction, args) => {
        const role = await getRole(interaction, interaction.values[0])
        const command = client.commands.get('noxprole')

        if (noXpRoles(interaction, role, 'remove')) {
            await delay(2000)
            interaction.reply({
                embeds: [new MessageEmbed({
                    description: `Acabo de eliminar el rol ${role} de la lista!`,
                    color: "YELLOW"
                })],
                ephemeral: true
            });
            interaction.message.delete()
            command.run(client, interaction, ['list'])
        }
    }
}