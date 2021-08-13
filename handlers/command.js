const { readdirSync } = require("fs");
const { WebhookClient, MessageEmbed } = require("discord.js");
const ascii = require("ascii-table");
const { webHookErrorMessage } = require("./functions");
let table = new ascii("Commands");
table.setHeading("Command", "Load status");
module.exports = (client) => {
  try{
    readdirSync("./commands/").forEach((dir) => {
        const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            if (pull.name) {
                client.commands.set(pull.name.toLowerCase(), pull);
                table.addRow(file, "Ready");
            } else {
                table.addRow(file, `error->missing a help.name,or help.name is not a string.`);
                continue;
            }
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
        }
    });
    console.log(table.toString().cyan);
  }catch (e){
    console.log(String(e.stack).bgRed);
    webHookErrorMessage(e,"Error en commands.js");
  }
};


