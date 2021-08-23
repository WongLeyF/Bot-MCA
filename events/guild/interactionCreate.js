const { MessageEmbed } = require("discord.js");
const ee = require("../../json/embed.json");
const gm = require("../../json/globalMessages.json");

module.exports = async (client, interaction) => {
    // console.log(client.interactions)
    const args = interaction.customId.split(/ +/);
    //creating the cmd argument by shifting the args by 1
    const cmd = args.shift().toLowerCase();
    let interactions = client.interactions.get(cmd);
    if (interactions.memberpermissions && !interaction.member.permissions.has(interactions.memberpermissions)) {
        try { interaction.delete(); } catch { }
        return interaction.channel.send({
            embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`❌ No puedes usar este comando, necesitas estos permisos: \`${interactions.memberpermissions.join("`, `")}\``)
            ]
        }).then(msg => setTimeout(() => msg.delete(), 10000)).catch(() => console.log("Couldn't Delete --> Ignore".gray));
    }
    let required_perms = ["ADD_REACTIONS", "PRIORITY_SPEAKER", "VIEW_CHANNEL", "SEND_MESSAGES",
        "EMBED_LINKS", "CONNECT", "SPEAK", "DEAFEN_MEMBERS"]
    if (!interaction.guild.me.permissions.has(required_perms)) {
        return interaction.channel.send({
            embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(":warning: | ¡No tengo los permisos necesarios! ")
                .setDescription("Por favor, dame solo `ADMINISTRADOR`, porque lo necesito para eliminar mensajes, crear canales y ejecutar todos los comandos de administrador. \n Si no quieres dármelos, entonces esos son los permisos exactos que necesito: \n> `" + required_perms.join("`, `") + "`")
            ]
        })
    }
    interactions.run(client, interaction, args);

}