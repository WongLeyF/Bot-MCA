//here the event starts
module.exports = client => {
  try{
    const templength = 34;
    console.log("\n")
    console.log(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
    console.log(`┃ `.bold.brightGreen + " ".repeat(-1+templength-` ┃ `.length)+ "┃".bold.brightGreen)
    console.log(`┃    `.bold.brightGreen + `Discord Bot is online!`.bold.brightGreen + " ".repeat(-1+templength-3-` ┃ `.length-`Discord Bot is online!`.length)+ "┃".bold.brightGreen)
    console.log(`┃ `.bold.brightGreen + ` /--/ ${client.user.tag} /--/ `.bold.brightGreen+ " ".repeat(-1+templength-` ┃ `.length-` /--/ ${client.user.tag} /--/ `.length)+ "┃".bold.brightGreen)
    console.log(`┃ `.bold.brightGreen + " ".repeat(-1+templength-` ┃ `.length)+ "┃".bold.brightGreen)
    console.log(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
  }catch{ /* */ }

  // try{
  //   client.user.setActivity(client.user.username, { type: "PLAYING" });
  // }catch (e) {
  //     console.log(String(e.stack).red);
  // }
  // //Change status each 10 minutes
  // setInterval(()=>{
  //   try{
  //     client.user.setActivity(client.user.username, { type: "PLAYING" });
  //   }catch (e) {
  //       console.log(String(e.stack).red);
  //   }
  // }, 10*60*1000)
}


