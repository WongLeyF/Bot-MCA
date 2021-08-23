const { readdirSync } = require("fs");
const ascii = require("ascii-table");
const { webHookErrorMessage } = require("./functions");
let table = new ascii("Interactions");
table.setHeading("Interactions", "Load status");
module.exports = (client) => {
  try{
    readdirSync("./interactions/").forEach((dir) => {
        const interactions = readdirSync(`./interactions/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of interactions) {
            let pull = require(`../interactions/${dir}/${file}`);
            if (pull.name) {
                client.interactions.set(pull.name.toLowerCase(), pull);
                table.addRow(file, "Ready");
            } else {
                table.addRow(file, `error->missing a help.name,or help.name is not a string.`);
                continue;
            }
            if (pull.interactions && Array.isArray(pull.interactions)) pull.interactions.forEach((interaction) => client.interactions.set(interaction, pull.name));
        }
    });
    console.log(table.toString().cyan);
  }catch (e){
    console.log(String(e.stack).bgRed);
    webHookErrorMessage(e,"Error en commands.js");
  }
};


