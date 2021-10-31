const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { getReactionMenus } = require("../../handlers/controllers/settings.controller");
const { simpleEmbedDescription } = require("../../handlers/functions");
const ee = require("../../json/embed.json");
const gm = require("../../json/globalMessages.json");

module.exports = {
    name: "showmenu",
    category: "📍 Auto-roles",
    description: "Shows the menu for the Auto-roles command.",
    usage: "showmenu [id]",
    permissions: ["SEND_MESSAGES"],
    run: async (client, message, args, user, text, prefix) => {
        // If args is empty, show all menus.
        if (args.length === 0) {
            const menus = await getReactionMenus(message);
            // console.log(menus);
            if (menus.length === 0){
                const desc = '❌ ¡No hay menús creados!';
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true);
                // return message.channel.send(`There are no menus.`);
            } 
            const embed = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle(`Lista de menus`)
                .setDescription(`Menus:`);
            for (const menu of menus) {
                embed.addField(`${menu.id}`, `${menu.name ? menu.name: 'Sin especificar'}`);
            }
            return message.channel.send({embeds: [embed]});
        }else{
            const menu = await getReactionMenus(message, args[0]);
            //get index of menu in array
            // console.log(menu);
            const index = menu.indexOf(menu.find(x => x._id == args[0]))
            // console.log(index);
            if (index === -1){
                const desc = `❌ ¡No encontre el menú con ese ID \`${args[0]}\`!`;
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true);
                // return message.channel.send(`Menu not found.`);
            }
            if (menu.length === 0) {
                const desc = `❌ ¡No encontre el menú con ese ID \`${args[0]}\`!`;
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true);
                // return message.channel.send(`There is no menu with the ID \`${args[0]}\`.`);
            }
            let optionsRoles = [];
            if (menu[index].reactionRoles.length > 0) {
                let i = 1;
                for (const reactionRole of menu[index].reactionRoles) {
                    message.guild.roles.cache.filter(role => role.id === reactionRole.role).map(role => {
                        optionsRoles.push({
                            label: role.name,
                            value: role.id,
                            description: reactionRole.description,
                            emoji: reactionRole.emoji
                        })
                    });
                }
                const row = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`showmenu ${menu[index]._id}`)
                        .setPlaceholder(menu[index].placeholder ? menu[index].placeholder: "Menu " + menu[index]._id)
                        .addOptions(optionsRoles) 
                        .setMinValues(0)
                        // .setMaxValues(optionsRoles.length) 
                );
                const container = {
                    components: [row]
                }
                if (menu[index].title) {
                    container.embeds = [
                        new MessageEmbed()
                            .setDescription(
                                menu[index].name ? menu[index].name : `🏆 **Menu ${+ menu[index]._id}**`)
                            .setColor("GREEN")
                    ]
                }else{
                 container.content= `${menu[index].name}`
                }
                message.channel.send(container)
            }else{
                const desc = `❌ ¡No hay roles asociados a este menú!`;
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true);
                // return message.channel.send(`There are no roles in this menu.`);
            }
        }
    }
}

