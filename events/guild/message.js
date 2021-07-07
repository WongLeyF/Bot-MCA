/**
  * @INFO
  * Loading all needed File Information Parameters
*/
const ee = require("../../json/embed.json"); //Loading all embed settings like color footertext and icon ...
const gm = require("../../json/globalMessages.json");
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const { MessageEmbed } = require("discord.js");
const { escapeRegex, getPrefix, getMessageCount, getLevelSystem, errorMessageEmbed } = require("../../handlers/functions"); //Loading all needed functions
const messageCount = require("../listeners/messageCounter");
const randomXp = require("../listeners/randomXP");


//here the event starts
module.exports = async (client, message) => {
  try {
    //if the message is not in a guild (aka in dms),if the message  author is a bot, return aka ignore the inputs
    if (!message.guild || message.author.bot) return;
    //if the channel is on partial fetch it
    if (message.channel.partial) await message.channel.fetch();
    //if the message is on partial fetch it
    if (message.partial) await message.fetch();
    //function to count message of users
    let status = await getMessageCount(message);
    if (status == null ? true : status) messageCount(message)
    //function to level system of users
    status = await getLevelSystem(message)
    if (status == null ? true : status) randomXp(client, message)
    //get the current prefix from the env.prefix or mongodb
    let prefix = await getPrefix(message) || process.env.prefix
    //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)}|${escapeRegex(prefix).toUpperCase()})\\s*`);
    //if its not that then return
    if (!prefixRegex.test(message.content)) return;
    //now define the right prefix either ping or not ping
    const [, matchedPrefix] = message.content.match(prefixRegex);
    //create the arguments with sliceing of of the rightprefix length
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    //creating the cmd argument by shifting the args by 1
    const cmd = args.shift().toLowerCase();
    //if no cmd added return error
    if (cmd.length === 0) {
      if (matchedPrefix.includes(client.user.id))
        return message.channel.send(new Discord.MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`Eh? Me tagearon? Deja te ayudo`)
          .addField(`Descripcion`,`Soy un bot en desarrollo, para el server Minecrafteando Alone, cuento con un sistema de niveles, confesiones, varias opciones de moderacion y algunas otras utilidades`)
          .setDescription(`Para ver todos los comandos, escribe: \`${prefix}help\``)
        );
      return;
    }
    //get the command from the collection
    let command = client.commands.get(cmd);
    //if the command does not exist, try to get it by his alias
    if (!command) command = client.commands.get(!client.aliases.get(cmd) ? undefined : client.aliases.get(cmd).toLowerCase());
    //if the command is now valid
    if (command) {
      if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
        client.cooldowns.set(command.name, new Discord.Collection());
      }
      const now = Date.now(); //get the current time
      const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
      const cooldownAmount = (command.cooldown || 1.5) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
      if (timestamps.has(message.author.id)) { //if the user is on cooldown
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
        if (now < expirationTime) { //if he is still on cooldonw
          const timeLeft = (expirationTime - now) / 1000; //get the lefttime
          return message.channel.send(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(`:warning: Por favor espera ${timeLeft.toFixed(1)} segundo(s) para volver a usar el comando \`${command.name}\`.`)
          ).then(msg => msg.delete({ timeout: 8000 }).catch(e => console.log("Couldn't Delete --> Ignore".gray))); //send an information message
        }
      }
      timestamps.set(message.author.id, now); //if he is not on cooldown, set it to the cooldown
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again
      try {
        //try to delete the message of the user who ran the cmd
        //try{  message.delete();   }catch{}
        //if Command has specific permission return error
        if (command.memberpermissions && !message.member.hasPermission(command.memberpermissions)) {
          try { message.delete(); } catch { }
          return message.channel.send(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setDescription(`❌ No puedes usar este comando, necesitas estos permisos: \`${command.memberpermissions.join("`, ``")}\``)
          ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log("Couldn't Delete --> Ignore".gray)));
        }
        //if the Bot has not enough permissions return error
        let required_perms = ["ADD_REACTIONS", "PRIORITY_SPEAKER", "VIEW_CHANNEL", "SEND_MESSAGES",
          "EMBED_LINKS", "CONNECT", "SPEAK", "DEAFEN_MEMBERS"]
        if (!message.guild.me.hasPermission(required_perms)) {
          return message.channel.send(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":warning: | ¡No tengo los permisos necesarios! ")
            .setDescription("Por favor, dame solo `ADMINISTRADOR`, porque lo necesito para eliminar mensajes, crear canales y ejecutar todos los comandos de administrador. \n Si no quieres dármelos, entonces esos son los permisos exactos que necesito: \n> `" + required_perms.join("`, `") + "`")
          )
        }
        //run the command with the parameters:  client, message, args, user, text, prefix,
        command.run(client, message, args, message.member, args.join(" "), prefix);
      } catch (e) {
        console.log(String(e.stack).red)
        return message.channel.send(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(":warning: Something went wrong while, running the: `" + command.name + "` command")
          .setDescription(`\`\`\`${e.message}\`\`\``)
        ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log("Couldn't Delete --> Ignore".gray)));
      }
    }
  } catch (e) {
    errorMessageEmbed(e, message)
  }
}
