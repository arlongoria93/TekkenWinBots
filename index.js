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
const printTotalWins = (mention, msg) => {
  let ids = [];
  mention.users.each((user) => {
    ids.push(user.id);
  });
  if (ids.length === 2) {
    const text =
      "SELECT * FROM records WHERE (player1_id=$1 OR player1_id=$2) AND (player2_id=$2 OR player2_id=$1)";

    const values = [ids[0]];
    clientdb.query(text, values, (err, res) => {
      // console.log(res.rows[0].player1_wins, res.rows[0].player2_wins);
      msg.channel.send(
        `<@${res.rows[0].player1_id}> W: ${res.rows[0].player1_wins} <@${res.rows[0].player2_id}> W: ${res.rows[0].player2_wins}`
      );
      if (err) console.log(err);
    });
  }
  if (ids.length === 1) {
    const text = "SELECT * FROM records WHERE (player1_id=$1 OR player2_id=$1)";
    const values = [ids[0]];
    clientdb.query(text, values, (err, res) => {
      // console.log(res.rows[0].player1_wins, res.rows[0].player2_wins);
      let totalWins = 0;
      res.rows.forEach((row) => {
        if (row.player1_id == ids[0]) {
          totalWins += row.player1_wins;
        } else {
          totalWins += row.player2_wins;
        }
      });
      msg.channel.send(`W: ${totalWins}`);

      if (err) console.log(err);
    });
  }
};
let player1Wins = 100;
client.on("message", (msg) => {
  if (!msg.content.startsWith("!") || msg.author.bot) return;

  let message = msg.content;
  const args = message.slice(1).trim().split(" ");
  const commandName = args.shift().toLowerCase();

  if (commandName === "wins") {
    if (msg.mentions.length > 1) return "err";
    //mention === msg.mentions
    printTotalWins(msg.mentions, msg);
  } else if (commandName === "add") {
  }

  if (msg.content === "test") {
    const text =
      "INSERT INTO records(player1_id,player2_id,player1_wins,player2_wins) VALUES ($1,$2,$3,$4)";
    const values = [];
    clientdb.query(text, values, (err, res) => {
      if (err) console.log(err);
    });
  }
});

client.login("ODI4Njg4NzkwMjM5MTgyODQ4.YGtOkw.PkFYN5bPq67FeilRHgmioDfPBfg");
