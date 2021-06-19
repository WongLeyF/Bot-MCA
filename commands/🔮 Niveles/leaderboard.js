const { MessageEmbed, WebhookClient } = require("discord.js")
const ee = require("../../botconfig/embed.json")
const gm = require("../../botconfig/globalMessages.json")
const settings = require("../../models/setting_schema")
const mongo = require('../../handlers/mongo')
const { getLeaderboard, getLeaderboardRange } = require("../../handlers/functions")

module.exports = {
    name: "Leaderboard",
    aliases: ["lb"],
    description: "Muestra una tabla con los 10 primeros rangos",
    category: "🔮 Niveles",
    cooldown: 5,
    usage: "Leaderboard [Posicion]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            if (args[0] && !isNaN(args[0])) return await getLeaderboardRange(client, message, args[0])
            await getLeaderboard(client, message)
        } catch (e) {
            console.log(String(e.stack).bgRed);
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
    },
};