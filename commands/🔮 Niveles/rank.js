const { MessageEmbed } = require("discord.js")
const ee = require("../../botconfig/embed.json")
const gm = require("../../botconfig/globalMessages.json")
const Levels = require("discord-xp")
const canvacord = require("canvacord")
const { getLeaderboardSpecific, getLeaderboard } = require("../../handlers/functions")
const Discord = require("discord.js")
const { getUserSettings } = require("../../handlers/functions")

module.exports = {
    name: "Rank",
    description: "Muestra tu tarjeta de rango",
    category: "🔮 Niveles",
    cooldown: 2,
    usage: "rank [Mencion]",
    run: async (client, message, args, user, text, prefix) => {
        try {
            const member = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
            const data = await getUserSettings(message, member.id)
            const rankpos = await getLeaderboardSpecific(client, message.guild.id, member.id)
            const user = await Levels.fetch(member.id, message.guild.id);
            const rank = new canvacord.Rank()
                .setAvatar(member.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setCurrentXP(user.xp - Levels.xpFor(parseInt(user.level)))
                .setRequiredXP(Levels.xpFor(parseInt(user.level + 1)) - Levels.xpFor(parseInt(user.level)))
                .setLevel(user.level)
                .setRank(rankpos)
                .setProgressBar("#FFFFFF", "COLOR")
                .setUsername(member.username, message.guild.member(message.member).displayHexColor)
                .setDiscriminator(member.discriminator);
            try {
                if(data){if (data.imgRank) rank.setBackground("IMAGE", data.imgRank)
                if (data.colorBackground) rank.setBackground("COLOR", data.colorBackground)
                if (data.colorStatus) rank.setStatus(data.colorStatus)
                if (data.colorBar) rank.setProgressBar(data.colorBar, "COLOR")}
                rank.build().then(data => {
                    const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                    message.channel.send(attachment);
                });
            } catch (e) {
                console.log(e)
                if(data)rank.setBackground("COLOR", data.colorBackground)
                rank.build().then(data => {
                    const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                    message.channel.send(attachment);
                });
            }
        } catch (e) {
            const member = message.author;
            const data = await getUserSettings(message, member.id)
            const rankpos = await getLeaderboardSpecific(client, message.guild.id, member.id)
            const user = await Levels.fetch(member.id, message.guild.id);
            const rank = new canvacord.Rank()
                .setAvatar(member.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setCurrentXP(user.xp - Levels.xpFor(parseInt(user.level)))
                .setRequiredXP(Levels.xpFor(parseInt(user.level + 1)) - Levels.xpFor(parseInt(user.level)))
                .setLevel(user.level)
                .setRank(rankpos)
                .setProgressBar("#FFFFFF", "COLOR")
                .setUsername(member.username, message.guild.member(message.member).displayHexColor)
                .setDiscriminator(member.discriminator);
            try {
                if(data){if (data.colorBackground) rank.setBackground("COLOR", data.colorBackground)
                if (data.imgRank) rank.setBackground("IMAGE", data.imgRank)
                if (data.colorStatus) rank.setStatus(data.colorStatus)
                if (data.colorBar) rank.setProgressBar(data.colorBar, "COLOR")}
                rank.build().then(data => {
                    const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                    message.channel.send(attachment);
                });
            } catch (e) {
                console.log(e)
                rank.setBackground("COLOR", data.colorBackground)
                rank.build().then(data => {
                    const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                    message.channel.send(attachment);
                });
            }
        }
    },
}