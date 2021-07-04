const { getLeaderboard, getLeaderboardRange, errorMessageEmbed } = require("../../handlers/functions")

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
            errorMessageEmbed(e, message)
        }
    },
};