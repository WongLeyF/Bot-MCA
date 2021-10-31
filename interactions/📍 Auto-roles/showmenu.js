const { MessageEmbed } = require("discord.js");
const { noXpRoles } = require("../../handlers/controllers/settingsXp.controller");
const { getRole, delay } = require("../../handlers/functions");

module.exports = {
    name: "showmenu",
    memberpermissions: [],
    run: async (client, interaction, args) => {
        // Validate if the interaction value length is correct
        if (interaction.values.length < 1) 
        return interaction.reply({
            content: "No se está ejecutando ninguna interacción. Por favor hágalo de nuevo",
            ephemeral: true
        });
        // console.log(interaction,1)
        const role = await getRole(interaction, interaction.values[0])
        // console.log(interaction)
        //get user of interaction
        const member = interaction.guild.members.cache.get(interaction.member.user.id)
        //has a role
        if (member.roles.cache.has(role.id)) {
            //remove role
            member.roles.remove(role.id)
            //send message
            interaction.reply({
                embeds: [new MessageEmbed({
                    description: `${member.user.tag}se te ha quitado el rol \`${role.name}\`.`,
                    color: "YELLOW"
                })],
                ephemeral: true
            });
            // interaction.channel.send(`${member.user.tag} has been removed from the ${role.name} role.`)
        } else {
            //add role
            member.roles.add(role.id)
            //send message
            interaction.reply({
                embeds: [new MessageEmbed({
                    description: `${member.user.tag} se te ha asignado el rol \`${role.name}\`.`,
                    color: "GREEN"
                })],
                ephemeral: true
            });           
        } 
    }
}