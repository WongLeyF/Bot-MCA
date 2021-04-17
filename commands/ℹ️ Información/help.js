const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "help",
    category: "ℹ️ Información",
    aliases: ["h", "commandinfo", "cmds", "cmd"],
    cooldown: 4,
    usage: "help [Command]",
    description: "Devuelve todos los comandos o un comando específico ",
    run: async (client, message, args, user, text, prefix) => {
      try{
        if (args[0]) {
          const embed = new MessageEmbed();
          const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
          if (!cmd) {
              return message.channel.send(embed.setColor(ee.wrongcolor).setDescription(`No se encontró información para el comando  **${args[0].toLowerCase()}**`));
          }
          if (cmd.name) embed.addField("**Nombre del comando**", `\`${cmd.name}\``);
          if (cmd.name) embed.setTitle(`Información detallada sobre:\`${cmd.name}\``);
          if (cmd.description) embed.addField("**Descripción**", `\`${cmd.description}\``);
          if (cmd.aliases) embed.addField("**Aliases**", `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
          if (cmd.cooldown) embed.addField("**Tiempo de espera**", `\`${cmd.cooldown} Segundos\``);
          else embed.addField("**Tiempo de espera**", `\`1 Tiempo de espera\``);
          if (cmd.usage) {
              embed.addField("**Uso**", `\`${config.prefix}${cmd.usage}\``);
              embed.setFooter("Sintaxis : <> = requerida, [] = opcional");
          }
          return message.channel.send(embed.setColor(ee.color));
        } else {
          const embed = new MessageEmbed()
              .setColor(ee.color)
              .setThumbnail(client.user.displayAvatarURL())
              .setTitle("» Menú Help | Comandos de "+ client.user.username)
              .setFooter(`Para ver la descripcion e información de los comandos, escriba: ${config.prefix}help <comando>`, client.user.displayAvatarURL());
          const commands = (category) => {
              return client.commands.filter((cmd) => cmd.category === category).map((cmd) => `${cmd.name}`);
          };
          try {
            for (let i = 0; i < client.categories.length; i += 1) {
              const current = client.categories[i];
              const items = commands(current);
              const n = 3;
              const result = [[], [], []];
              const wordsPerLine = Math.ceil(items.length / 3);
              for (let line = 0; line < n; line++) {
                  for (let i = 0; i < wordsPerLine; i++) {
                      const value = items[i + line * wordsPerLine];
                      if (!value) continue;
                      result[line].push(value);                 
                  }
              }
              
              embed.addField(`**${current.charAt(0).toUpperCase()+ current.slice(1)} **`, ` ${result[0].join("\n")}`, true);
              embed.addField(`\u200b`, `${result[1].join("\n") ? result[1].join("\n") : "\u200b"}`, true);
              embed.addField(`\u200b`, `${result[2].join("\n") ? result[2].join("\n") : "\u200b"}`, true);
              console.log(embed)
            }
          } catch (e) {
              console.log(String(e.stack).red);
          }
          message.channel.send(embed);
      }
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`:warning: ERROR | Algo salió mal`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
    }
  }
}

