const { yellow } = require("colors");
const { getReactionMenuById, saveMenuRole, updateMenuRole } = require("../../handlers/controllers/settings.controller");
const { getRole, simpleMessage, simpleEmbedDescription } = require("../../handlers/functions");
const ee = require("../../json/embed.json");
const gm = require("../../json/globalMessages.json");

module.exports = {
    name: "reactionmenu",
    category: "📍 Auto-roles",
    description: "Create a reaction menu for a role",
    usage: "reactionmenu <ID> <role> <emoji> <description>",
    permission: ["MANAGE_ROLES"],
    run: async (client, message, args, prefix) => {
        let desc = ''
        // Validate if args contains the required arguments
        if (!args[0] || !args[1] || !args[2]) {
            desc = '❌ Necesito que los siguientes argumentos: \`ID\`, \`role\`, \`emoji\` and \`description\`'
            return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
            //  return message.channel.send(`🤔 **|** You need to provide the following arguments: \`ID\`, \`role\`, \`emoji\` and \`description\``);
        } 

        //Validate if ID is a number
        if (isNaN(args[0])){
            desc = '❌ El ID debe ser un numero, por favor dame uno valido'
            return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
            //return message.channel.send("Please provide a valid ID");
        } 
        //Check if args[0] is a valid role else vlaidate if args[1] is a valid role
        let roleData = await getRole(message, args[1]);
        // console.log(roleData);
        if (!roleData) { 
            desc = '❌ No pude encontrar ese rol'
            return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
            // return errorMessage(message, "That role does not exist!");
        }

        // Check if the emoji is a discord emoji
        let emoji = args[2];
        if (!emoji) {
            // console.log("No emoji provided");
            desc = '❌ ¡Proporciona un emoji!'
            return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
            // return errorMessage(message,` Please provide an emoji!`);
        }else{
            if (!/(:|<:|<a:)((\w{1,64}:\d{17,18})|(\w{1,64}))(:|>)/.test(emoji)){
                if (!/[\uD800-\uDBFF]|[\u2702-\u27B0]|[\uF680-\uF6C0]|[\u24C2-\uF251]/.test(emoji)){
                    // console.log("invalid emoji 2");
                    // return errorMessage(message,` Please provide a valid emoji!`);
                    desc = '❌ ¡Proporciona un emoji valido!'
                    return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
                }  
            } 
        }

        // Check if the message is a valid message
        let description = args.slice(3).join(" ");
        if (!description) {
            desc = '❌ ¡Proporciona una descripcion!'
            return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
            // return errorMessage(message,` Please provide a message!`);
        }else{  
            if (description.length > 255) {
                desc = '❌ Proporcione un mensaje con menos de 255 caracteres.'
                return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, desc, true)
                // return errorMessage(message,` Please provide a message with less than 255 characters!`);
            }
        }

        // Check if the role is already in the reaction menu
        const reactionMenu = await getReactionMenuById(message, args[0]);
        if (reactionMenu) {
            // console.log("reaction menu exists");
            // simpleMessage(message, `That reaction menu already exists!`);
            reactionMenu.reactionRoles = [...reactionMenu.reactionRoles, {
                role: roleData.id,
                emoji: emoji,
                description: description
            }];
            updateMenuRole(message, args[0], roleData.id, emoji, description);
            desc = '✅ ¡El menu de reacciones se actualizo correctamente!'
            return simpleEmbedDescription(message, ee.checkcolor, gm.longTime, desc, true)
            // simpleMessage(message, `Added ${roleData.name} to the reaction menu!`);
            // return console.log(`Added ${roleData.name} to the reaction menu!`);
        }else{
            // console.log("reaction menu does not exist");
            // simpleMessage(message, `That reaction menu does not exist!`);
            desc = '❌ ¡El menu de reacciones no existe, se creo uno nuevo!'
            simpleEmbedDescription(message, yellow, gm.longTime, desc, true)

            saveMenuRole(message, args[0], roleData.id, emoji, description);

            desc = '✅ ¡El menu de reacciones se actualizo correctamente!'
            return simpleEmbedDescription(message, ee.checkcolor, gm.longTime, desc, true)
            // simpleMessage(message, `Added ${roleData.name} to the reaction menu!`);
            // return console.log(`Added ${roleData.name} to the reaction menu! 2`);
        }
    }
}