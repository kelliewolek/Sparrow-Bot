const express = require("express");
const app = express()



app.get("/",(req, res)=> {
  res.send("Hello, world!");
})

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]});
app.get("/debug/", (req, res) => {
  res.send({"debugToken": client.token})
}) //debug things
app.listen(3657,()=> {
  console.log("project is running!")
})
client.on("message",message => {
  if(message.content === "ping"){
    message.channel.send("pong")
  }
})

client.on("voiceStateUpdate", async v => {
  if(v.streaming == true) (await client.channels.fetch("1030464034845241385")).send(`${(await client.users.fetch(v.id)).tag} started streaming in <#${v.channelId}>`)
})

client.on("guildMemberUpdate", async(o, n) => {
  if(o.nickname != n.nickname) {
    (await client.channels.fetch("1030464034845241385")).send(`${n.user.tag} changed their nickname from \`${o.nickname}\` to \`${n.nickname}\`.`)
  }
  
  if(o.roles.cache.size != n.roles.cache.size) {
    let ar = [];
    let ar2 = [];
    (() => {return new Promise((res, rej) => {n.roles.cache.forEach(role => {
            if (!o.roles.cache.has(role.id)) ar.push(role.name);
        });
    o.roles.cache.forEach(role => {
            if (!n.roles.cache.has(role.id)) ar2.push(role.name);
      res()
        })})})().then(async () => {
      (await client.channels.fetch("1030464034845241385")).send(`${n.user.tag} roles got updated!\nAdded roles: ${ar.length != 0 ? ar.join(" ") : "No roles added"}\nRemoved roles: ${ar2.length != 0 ? ar2.join(" ") : "No roles removed"}`)
        })
    
  }
})
client.on("guildMemberAdd", async m => {
  (await client.channels.fetch("1030464034845241385")).send(`${m.user.tag} joined the server!`)
})
client.on("guildMemberRemove",async m => {
  (await client.channels.fetch("1030464034845241385")).send(`${m.user.tag} left the server :(`)
})
client.on("messageDelete",async m => {
  (await client.channels.fetch("1030464034845241385")).send(`${m.author.tag}'s message got deleted in ${m.channel}! Content: ${m.content}`)
})
client.on("ready", () => console.log("r"))
//client.login(process.env.token)
