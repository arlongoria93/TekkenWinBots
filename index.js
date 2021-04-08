const Discord = require("discord.js");
const client = new Discord.Client();

const { Client } = require("pg");
const clientdb = new Client({
  user: "angelo",
  host: "localhost",
  database: "tekkenwins",
  password: "123",
  port: "5432",
});
clientdb.connect();

client.on("ready", () => {
  console.log(`Hello World!`);
});

//wins
// wins @player
// add w @player
// add 5 w @player
// add(5,w)
const printTotalWins = (mention) => {
  console.log(mention);
};
let player1Wins = 100;
client.on("message", (msg) => {
  if (!msg.content.startsWith("!") || msg.author.bot) return;

  let message = msg.content;
  let splitMessage = message.split(" ");
  splitMessage.shift();
  if (splitMessage[0] === "wins") {
    if (msg.mentions.length > 1) return "err";
    //mention === msg.mentions
    printTotalWins(msg.mentions);
  } else if (splitMessage[0] === "add") {
  }

  if (msg.content === "test") {
    const text =
      "INSERT INTO records(player1_id,player2_id,player1_wins,player2_wins) VALUES ($1,$2,$3,$4)";
    const values = [];
    // clientdb.query(text, values, (err, res) => {
    //   if (err) console.log(err);
    // });
  }
});

client.login("ODI4Njg4NzkwMjM5MTgyODQ4.YGtOkw.PkFYN5bPq67FeilRHgmioDfPBfg");
