const { MessageAttachment } = require("discord.js")
const Canvas = require('canvas');

const rowLeaderboard = async function (client, {
    guildID,
    userID,
    xp,
    level,
    position,
    username,
    discriminator
}) {
    return new Promise(async (resolve) => {

        const canvas = Canvas.createCanvas(700, 80)
        const ctx = canvas.getContext("2d")
        const bgr = await Canvas.loadImage('./assets/img/leaderboard.png')
        const avatar = await Canvas.loadImage(client.users.cache.get(userID).displayAvatarURL({ format: 'jpg' }))
        const levelText = `• LVL:${level}`
        const xpText = `• XP:${xp.toLocaleString()}`

        ctx.drawImage(avatar, 13, 5, canvas.height - 10, canvas.height - 10)
        ctx.drawImage(bgr, 2, 0, canvas.width, canvas.height)
        ctx.fillStyle = position == 1 ? "#FFD700": position == 2? "#888888": position == 3? "#AF6D00" :"#2A2A2A"
        ctx.font = 'normal bold 25px sans-serif'
        let text = `${position} ‣ `
        let x = (canvas.height - 30 + ctx.measureText(text).width) - (position >= 10 ? position.toString().length*8 : 0)
        ctx.fillText(text, canvas.height + 25, 46)
        ctx.fillStyle = "#2A2A2A"
        x = x + ctx.measureText(text).width
        text = ` ${username}#${discriminator}`
        ctx.fillText(text, x, 46)
        x = ctx.measureText(levelText).width > ctx.measureText(xpText).width ? ctx.measureText(levelText).width : ctx.measureText(xpText).width
        ctx.font = ' normal bold 18px sans-serif'
        ctx.fillText(levelText, canvas.width - x , 30) 
        ctx.fillText(xpText, canvas.width - x , 60)
        resolve(canvas)
    })
}

module.exports = {
    rowLeaderboard,
    leaderboardCanvas: async function (client, message, rawArrayLb) {
        const w = (rawArrayLb.length * 80) + (rawArrayLb.length * 5)
        const canvas = Canvas.createCanvas(710, w < 80 ? 80 : w)
        const ctx = canvas.getContext("2d")
        // ctx.fillStyle = "#272727";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        let y = 0
        for (const key in rawArrayLb) {
            ctx.drawImage(await rowLeaderboard(client, rawArrayLb[key]), 2, y, 700, 80)
            y = y + 85
        }
        const attach = new MessageAttachment(canvas.toBuffer(), 'guild-lb.png')
        message.channel.send({ files: [attach] })

    }
}