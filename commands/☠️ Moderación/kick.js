const { MessageEmbed, WebhookClient } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const gm = require("../../botconfig/globalMessages.json");

module.exports = {
    name: "Kick",
    description: "Expulsar miembros del servidor",
    category: "☠️ Moderación",
    cooldown: 2,
    memberpermissions: ["KICK_MEMBERS"],
    usage: "kick <Tag/ID> [Razón de expulsión]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .addField(`❌ Por favor, especifica al usuario`, `Uso: \`${prefix}kick <Tag/ID> [Razón]\``)
            ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
            if (member.id === message.author.id) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription('❌ Estem, no puedes expulsarte a ti mismo...')
            ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
            if (!member.kickable) return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription('❌ No puedo expulsar a este usuario. Ya que es mod/admin o tiene un rol mas alto que el mio')
            ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));

            let reason = !args.slice(1).join(" ") ? 'Sin especificar' : args.slice(1).join(" ");
            await member.kick( reason )
            message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setTitle('Miembro Expulsado')
                .setThumbnail(member.user.displayAvatarURL())
                .addField('Usuario expulsado', member, true)
                .addField('ID', member.id, true)
                .addField('Expulsado por', message.author)
                .addField('Razon', reason)
                .setImage('https://media1.tenor.com/images/ca1bad80a757fa8b87dacd9c051f2670/tenor.gif')
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
            );
        } catch (e) {
            console.log(String(e.stack).bgRed)
            const webhookClient = new WebhookClient(process.env.webhookID, process.env.webhookToken);
            const embed = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(gm.titleError)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
            await webhookClient.send('Webhook Error', {
                username: message.guild.name,
                avatarURL: message.guild.iconURL({ dynamic: true }),
                embeds: [embed],
            });
        }
    }
};