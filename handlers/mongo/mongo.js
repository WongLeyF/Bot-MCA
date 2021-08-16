const mongoose = require('mongoose')

module.exports = async() => {
    await mongoose.connect(process.env.mongoPath,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepAlive: true, 
        keepAliveInitialDelay: 300000
    })
    const templength = 34;
    console.log("\n")
    console.log(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.green)
    console.log(`┃ `.bold.green + " ".repeat(-1 + templength - ` ┃ `.length) + "┃".bold.green)
    console.log(`┃ `.bold.green + `Connected to mongo!`.bold.green + " ".repeat(-1 + templength - ` ┃ `.length - `Connected to mongo!`.length) + "┃".bold.green)
    console.log(`┃ `.bold.green + " ".repeat(-1 + templength - ` ┃ `.length) + "┃".bold.green)
    console.log(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.green)
    return mongoose
}