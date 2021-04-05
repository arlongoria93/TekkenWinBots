const Discord = require("discord.js");
const client = new Discord.Client();

const { Client } = require("pg");
const clientdb = new Client({
  user: "angelo",
  host: "localhost",
  database: "test",
  password: "123",
  port: "5432",
});
clientdb.connect();
clientdb.query("SELECT * from person", (err, res) => {
  console.log(err ? err.stack : res.rows[0].message); // Hello World!
  clientdb.end();
});

client.on("ready", () => {
  console.log(`Hello World!`);
});

client.on("message", (msg) => {
  if (msg.content === "commands") {
    msg.reply("Pong!");
  }
});

client.login("ODI4Njg4NzkwMjM5MTgyODQ4.YGtOkw.PkFYN5bPq67FeilRHgmioDfPBfg");
