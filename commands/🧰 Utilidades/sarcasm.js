module.exports = {
    name: "sarcasm",
    aliases: ["s"],
    category: "🧰 Utilidades",
    usage: "sarcasm",
    description: "Refuerza el sarcasmo de una oracion",
    run: async (client, message, args) => {
        message.delete()
        message.channel.send("Es mame no un pito para que te lo tomes tan serio")
    }
}