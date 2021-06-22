const Levels = require("discord-xp");
const { getRandomNum, getlvlsettings, getLeaderboardSpecific, getChannelLevels } = require("../../handlers/functions");
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const canvacord = require("canvacord");
const { Database } = require("quickmongo");
const db = new Database(process.env.mongoPath);

module.exports = async (client, message) => {
    //if its not in the cooldownXP, set it too there
    const lvlsettings = await getlvlsettings(message)
    if (!client.cooldownXP.has("XP")) client.cooldownXP.set("XP", new Discord.Collection())
    const now = Date.now()
    const timestamps = client.cooldownXP.get("XP"); //get the timestamp of the last used commands
    const cooldownAmount = (lvlsettings ? lvlsettings.cooldown ? lvlsettings.cooldown : 60 : 60) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
    if (timestamps.has(message.author.id)) { //if the user is on cooldown
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
        if (now < expirationTime) { //if he is still on cooldonw
            const timeLeft = (expirationTime - now) / 1000; //get the lefttime
            return console.log(`Tiempo para mas xp: ${timeLeft.toFixed(1)}`)
        }
    }
    const minXP = lvlsettings ? lvlsettings.min_xp ? lvlsettings.min_xp : 1 : 1
    const maxXP = lvlsettings ? lvlsettings.max_xp ? lvlsettings.max_xp : 30 : 30
    timestamps.set(message.author.id, now); //if he is not on cooldown, set it to the cooldown
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
    const randomAmountOfXp = getRandomNum(minXP, maxXP); // Min 1, Max 30
    console.log(randomAmountOfXp)///////////////
    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
    const channelID = await getChannelLevels(message)
    if (hasLeveledUp) {
        const member = message.author;
        const user = await Levels.fetch(member.id, message.guild.id);
        if (await db.exists(`${message.guild.id}.${user.level}`)) {
            try {
                const rolereward = await db.get(`${message.guild.id}.${user.level}`)
                for (let i = user.level - 1; i >= 0; i--) {
                    if (await db.exists(`${message.guild.id}.${i}`)) {
                        const rolerw = await db.get(`${message.guild.id}.${i}`)
                        const rolesid = rolerw.map(r => String(r.roleid))
                        if (rolesid[0] != 0) {
                            const role = message.guild.roles.cache.get(rolesid[0]);
                            message.guild.member(message.member).roles.remove(role);
                        }
                        break;
                    }
                }
                const rolesid = rolereward.map(r => String(r.roleid))
                if (rolesid[0] != 0) {
                    const role = message.guild.roles.cache.get(rolesid[0]);
                    message.guild.member(message.member).roles.add(role);
                }
            } catch (error) {
                return message.reply(new MessageEmbed()
                    .setColor(ee.color)
                    .setTitle("⚠ Info STATUS")
                    .setDescription(`No pude asignar el rol`)
                ).then(msg => msg.delete({ timeout: 5000 }).catch(e => console.log(gm.errorDeleteMessage.gray)));
            }

        }
       // client.channels.cache.get(channelID).send(`Has subido de nivel a ${user.level} y  ${Levels.xpFor(parseInt(user.level) + 1)}\n${member}$`)
        // const rank = new canvacord.Rank()
        //     .setAvatar(member.displayAvatarURL({dynamic: false, format: 'png'}))
        //     .setCurrentXP(user.xp-Levels.xpFor(parseInt(user.level)))
        //     .setRequiredXP(Levels.xpFor(parseInt(user.level+1))-Levels.xpFor(parseInt(user.level)))
        //     .setLevel(user.level)
        //     .setRank(rankpos)
        //     //.setStatus('dnd')
        //     .setProgressBar("#FFFFFF", "COLOR")
        //     .setUsername(member.username)
        //     .setDiscriminator(member.discriminator);
        // rank.build().then(data => {
        //         const attachment = new Discord.MessageAttachment(data, "RankCard.png");
        //         message.channel.send(attachment);
        //     });
    }
}
