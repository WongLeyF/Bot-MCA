const Levels = require("discord-xp")
const Discord = require("discord.js")
const canvacord = require("canvacord")
const gm = require("../../json/globalMessages.json")
const ee = require("../../json/embed.json")
const { getLeaderboardSpecific, simpleEmbedDescription } = require("../../handlers/functions")
const { getUserSettings } = require("../../handlers/controllers/userSetings.controller")

module.exports = {
    name: "Rank",
    description: "Muestra tu tarjeta de rango",
    category: "🔮 Niveles",
    cooldown: 2,
    usage: "rank [Mencion]",
    run: async (client, message, args, userinfo, text, prefix) => {
        try {
            const member = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
            const data = await getUserSettings(message, member.id)
            const rankpos = await getLeaderboardSpecific(client, message.guild.id, member.id)
            console.log(member.id)
            if (!rankpos) return simpleEmbedDescription(message, ee.wrongcolor, gm.longTime, "No tienes ningun nivel registrado", true)
            const status = userinfo.guild.presences.cache.get(member.id) ? userinfo.guild.presences.cache.get(member.id).status : 'offline'
            const user = await Levels.fetch(member.id, message.guild.id);
            const rank = new canvacord.Rank()
                .setAvatar(member.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setCurrentXP(user.xp - Levels.xpFor(parseInt(user.level)))
                .setRequiredXP(Levels.xpFor(parseInt(user.level + 1)) - Levels.xpFor(parseInt(user.level)))
                .setLevel(user.level)
                .setRank(rankpos)
                .setStatus(status)
                .setProgressBar("#FFFFFF", "COLOR")
                .setUsername(member.username, message.guild.members.cache.get(userinfo.id).displayHexColor)
                .setDiscriminator(member.discriminator);

            if (data) {
                if (data.imgRank) rank.setBackground("IMAGE", data.imgRank)
                if (data.colorBackground) rank.setBackground("COLOR", data.colorBackground)
                if (data.colorBar) rank.setProgressBar(data.colorBar, "COLOR")
            }
            rank.build().then(data => {
                const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                message.channel.send({ files: [attachment] });
            }).catch(e => {
                if (e.code === 'ENOENT') {
                    rank.setBackground("COLOR", data.colorBackground ? data.colorBackground : '#2A2E35')
                    rank.build().then(data => {
                        const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                        message.channel.send({ files: [attachment] });
                    });
                }
            });
        } catch (e) {
            const member = message.author;
            const data = await getUserSettings(message, member.id)
            const status = userinfo.guild.presences.cache.get(member.id) ? userinfo.guild.presences.cache.get(member.id).status : 'offline'
            const rankpos = await getLeaderboardSpecific(client, message.guild.id, member.id)
            const user = await Levels.fetch(member.id, message.guild.id);
            console.log(message.guild.members.cache.get(userinfo.id))
            const rank = new canvacord.Rank()
                .setAvatar(member.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setCurrentXP(user.xp - Levels.xpFor(parseInt(user.level)))
                .setRequiredXP(Levels.xpFor(parseInt(user.level + 1)) - Levels.xpFor(parseInt(user.level)))
                .setLevel(user.level)
                .setRank(rankpos)
                .setStatus(status)
                .setProgressBar("#FFFFFF", "COLOR")
                .setUsername(member.username, message.guild.members.cache.get(userinfo.id).displayHexColor)
                .setDiscriminator(member.discriminator);
            if (data) {
                if (data.colorBackground) rank.setBackground("COLOR", data.colorBackground)
                if (data.imgRank) rank.setBackground("IMAGE", data.imgRank)
                if (data.colorBar) rank.setProgressBar(data.colorBar, "COLOR")
            }
            rank.build().then(data => {
                const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                message.channel.send({ files: [attachment] });
            }).catch(e => {
                if (e.code === 'ENOENT') {
                    rank.setBackground("COLOR", data.colorBackground ? data.colorBackground : '#2A2E35')
                    rank.build().then(data => {
                        const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                        message.channel.send({ files: [attachment] });
                    });
                }
            });

        }
    },
}