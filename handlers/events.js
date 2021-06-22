const fs = require("fs");
const ascii = require("ascii-table");
const mongo = require("./mongo");
const { WebhookClient, MessageEmbed } = require("discord.js");
let table = new ascii("Events");
table.setHeading("Events", "Load status");
const allevents = [];
module.exports = async (client) => {
  try{
    const load_dir = (dir) => {
      const event_files = fs.readdirSync(`./events/${dir}`).filter((file) => file.endsWith(".js"));
      for (const file of event_files){
        const event = require(`../events/${dir}/${file}`)
        let eventName = file.split(".")[0];
        allevents.push(eventName);
        client.on(eventName, event.bind(null, client));
      }
    }
    await ["client", "guild", "listeners"].forEach(e=>load_dir(e));
    for (let i = 0; i < allevents.length; i++) {
        try {
            table.addRow(allevents[i], "Ready");
        } catch (e) {
            console.log(String(e.stack).red);
        }
    }
    console.log(table.toString().cyan);
    await mongo().then(mongoose => {
      try {
        const templength = 34;
        console.log("\n")
        console.log(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.green)
        console.log(`┃ `.bold.green + " ".repeat(-1+templength-` ┃ `.length)+ "┃".bold.green)
        console.log(`┃ `.bold.green + `Connected to mongo!`.bold.green + " ".repeat(-1+templength-` ┃ `.length-`Connected to mongo!`.length)+ "┃".bold.green)
        console.log(`┃ `.bold.green + " ".repeat(-1+templength-` ┃ `.length)+ "┃".bold.green)
        console.log(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.green)
      } finally {
        mongoose.connection.close()
      }
    })
    try{
      const stringlength2 = 34;
      console.log("\n")
      console.log(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.yellow)
      console.log(`┃ `.bold.yellow + " ".repeat(-1+stringlength2-` ┃ `.length)+ "┃".bold.yellow)
      console.log(`┃ `.bold.yellow + `Logging into the BOT...`.bold.yellow + " ".repeat(-1+stringlength2-` ┃ `.length-`Logging into the BOT...`.length)+ "┃".bold.yellow)
      console.log(`┃ `.bold.yellow + " ".repeat(-1+stringlength2-` ┃ `.length)+ "┃".bold.yellow)
      console.log(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.yellow)
    }catch{ /* */ }
  }catch (e){
    console.log(String(e.stack).bgRed)
    const webhookClient = new WebhookClient(process.env.webhookID, process.env.webhookToken);
    const embed = new MessageEmbed()
       .setColor("RED")
       .setTitle("Error en events.js")
       .setDescription(`\`\`\`${e.stack}\`\`\``)
    webhookClient.send('Webhook Error', {
       username: "Critical Error",
       avatarURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Warning.svg/520px-Warning.svg.png",
       embeds: [embed],
    });
  }
};


