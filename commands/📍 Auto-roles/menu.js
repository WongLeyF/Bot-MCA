const { saveMenu, getReactionMenus, getReactionMenuById, newMenu, delMenu } = require("../../handlers/controllers/settings.controller");
const { simpleEmbedField, simpleEmbedDescription } = require("../../handlers/functions");
const ee = require("../../json/embed.json");
const gm = require("../../json/globalMessages.json");

module.exports = {
    name: 'menu',
    category: '📍 Auto-roles',
    description: 'Configure menu for the Auto-roles command.',
    usage: "menu add <ID> [name]\n"+
            "menu del <ID>\n"+
            "menu name <ID> <name> \n"+
            "menu desc <ID> <description> \n"+
            "menu embed <y/n>\n",
    permission: ["MANAGE_ROLES"],
    run: async (client, message, args) => {
        let menu, desc;
        // switch case for the command
        switch(args[0]) {
            case "add":
                // add a new menu
                if(args.length < 2) {
                    desc = '❌ ¡Proporciona un nombre para el menu!'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
                    // return message.channel.send("Please provide a name for the menu.");
                }
                // get the menu from the database
                menu = await getReactionMenuById(message, args[1]);
                // if the menu does exist
                if(menu) {
                    desc = '❌ ¡El menu ya existe!'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
                    // return message.channel.send("The menu does exist.");
                }
                // add the menu to the database
                await newMenu(message, args[1], args.slice(2).join(" "));
                // send a message to the channel
                desc = '✅ ¡Menu agregado!'
                return simpleEmbedDescription(message, ee.checkcolor, gm.longTime, desc, true)
                // message.channel.send(`Menu ${args[1]} added.`);
                break;
            case "del":
                // delete a menu
                if(args.length < 2) {
                    desc = '❌ ¡Proporciona el ID del menu a eliminar!'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
                    // return message.channel.send("Please provide an ID.");
                }
                // get the menu from the database
                menu = await getReactionMenuById(message, args[1]);
                // if the menu doesn't exist
                if(!menu) {
                    desc = '❌ ¡El menu no existe!'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
                    // return message.channel.send("The menu doesn't exist.");
                }
                // delete the menu from the database
                await delMenu(message, args[1]);
                // send a message to the channel
                desc = '✅ ¡Menu eliminado!'
                return simpleEmbedDescription(message, ee.checkcolor, gm.longTime, desc, true)
                // message.channel.send(`Menu ${args[1]} deleted.`);
                break;
            /* case "config":
                // configure a menu
                if(args.length < 4) {
                    return message.channel.send("Please provide an ID, a name and a description.");
                }
                // get the menu from the database
                let menu = await getReactionMenuById(args[1]);
                // if the menu doesn't exist
                if(!menu) {
                    return message.channel.send("The menu doesn't exist.");
                }
                // set the menu's name
                menu.name = args[2];
                // set the menu's embed
                if(args[3] == "y") {
                    menu.embed = true;
                }
                else if(args[3] == "n") {
                    menu.embed = false;
                }
                else {
                    return message.channel.send("Please provide a valid value for embed.");
                }
                // set the menu's description
                menu.description = args.slice(4).join(" ");
                // update the menu in the database
                await client.db.updateMenu(menu);
                // send a message to the channel
                message.channel.send(`Menu ${menu.id} updated.`);
                break; */
            case "name":
                // change the name of a menu
                if(args.length < 3) {
                    desc = '❌ ¡Proporciona el ID del menu y el nuevo nombre!'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
                    // return message.channel.send("Please provide an ID and a name.");
                }
                // get the menu from the database
                menu = await getReactionMenuById(message, args[1]);
                // if the menu doesn't exist
                if(!menu) {
                    desc = '❌ ¡El menu no existe!'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
                    // return message.channel.send("The menu doesn't exist.");
                }
                // set the menu's name
                menu.name = args.slice(2).join(" ");
                // update the menu in the database
                await saveMenu(message, args[1], menu);
                // send a message to the channel
                desc = '✅ ¡Nombre del menu se ha actualizado!'
                return simpleEmbedDescription(message, ee.checkcolor, gm.longTime, desc, true)
                // message.channel.send(`Menu ${menu.id} updated.`);
                break;
            case "desc":
                // change the description of a menu
                if(args.length < 3) {
                    desc = '❌ ¡Proporciona el ID del menu y la nueva descripción!'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
                    // return message.channel.send("Please provide an ID and a description.");
                }
                // get the menu from the database
                menu = await getReactionMenuById(message, args[1]);
                // if the menu doesn't exist
                if(!menu) {
                    desc = '❌ ¡El menu no existe!'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
                    // return message.channel.send("The menu doesn't exist.");
                }
                // set the menu's description
                menu.placeholder = args.slice(2).join(" ");
                // update the menu in the database
                await saveMenu(message, args[1], menu);
                // send a message to the channel
                desc = '✅ ¡Descripción del menu se ha actualizado!'
                return simpleEmbedDescription(message, ee.checkcolor, gm.longTime, desc, true)
                // message.channel.send(`Menu ${menu.id} updated.`);
                break;
            case "embed":
                // change the embed of a menu
                if(args.length < 2) {
                    desc = '❌ ¡Proporciona el ID del menu y si sera embed (y/n)!'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
                    // return message.channel.send("Please provide a value for embed.");
                }
                // get the menu from the database
                menu = await getReactionMenuById(message, args[1]);
                // if the menu doesn't exist
                if(!menu) {
                    desc = '❌ ¡El menu no existe!'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
                    // return message.channel.send("The menu doesn't exist.");
                }
                // set the menu's embed
                if(args[2] == "y") {
                    menu.title = true;
                }
                else if(args[2] == "n") {
                    menu.title = false;
                }
                else {
                    desc = '❌ ¡Proporciona un valor valido para embed (y/n)!'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
                    // return message.channel.send("Please provide a valid value for embed.");
                }
                // update the menu in the database
                await saveMenu(message, args[1], menu);
                // send a message to the channel
                desc = '✅ ¡Embed del menu se ha actualizado!'
                return simpleEmbedDescription(message, ee.checkcolor, gm.longTime, desc, true)
                // message.channel.send(`Menu ${menu.id} updated.`);
                break;
            default:
                // send a message to the channel
                const titleEmbed = `:warning: ¡Comando no reconocido!`
                const descEmbed = `Por favor, escribe \`${prefix}help\` para ver la lista de comandos.`
                return simpleEmbedField(message, ee.wrongcolor, gm.longTime, titleEmbed, descEmbed)
                // message.channel.send("Please provide a valid command.");
                break;
            } 
    }
}