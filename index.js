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

//Check Wins Function
const checkWins = (msg) => {
  let user = msg.mentions.users.first();
  let authorId = msg.author.id;
  let text = `SELECT * FROM records WHERE ((player1_id=$1 AND player2_id=$2) OR (player1_id=$2 AND player2_id=$1))`;
  let values = [authorId, user.id];
  clientdb.query(text, values, (err, res) => {
    if (err) console.log(err);
    if (res && res.rows.length > 0) {
      console.log(res.rows);
      msg.channel.send(
        `<@${res.rows[0].player1_id}> has ${res.rows[0].player1_wins} wins against <@${res.rows[0].player2_id}>`
      );
    } else {
      msg.channel.send("No data for these players");
    }
  });
};

//Add To Wins Function
const addToWins = (msg) => {
  if (msg.mentions) {
    let user = msg.mentions.users.first();

    if (msg.author.id === user.id)
      return msg.channel.send("You cannot mention yourself!");
    let revisedCASE = `SELECT player1_id FROM records WHERE EXISTS(SELECT 1 FROM records WHERE player1_id=$1)`;
    let case2 = `SELECT player2_id FROM records WHERE EXISTS(SELECT 1 FROM records WHERE player2_id=$1)`;

    let value = [msg.author.id];

    clientdb.query(revisedCASE, value, (err, res) => {
      if (err) console.log(err);
      //NEED TO CHECK FOR MENTION PLAYER

      if (res && res.rows.length > 0 && res.rows[0].length === 4) {
        let text = `UPDATE records SET player1_wins = player1_wins+1 WHERE (player1_id=$1 AND player2_id=$2) OR  (player1_id=$2 AND player2_id=$1)`;
        let value = [msg.author.id, user.id];
        clientdb.query(text, value, (err, res) => {
          if (err) console.log(err);
        });
        return;
      }
    });
    clientdb.query(case2, value, (err, res) => {
      if (err) console.log(err);

      if (res && res.rows.length > 0) {
        let text = `UPDATE records SET player2_wins = player2_wins+1 WHERE (player1_id=$1 AND player2_id=$2) OR  (player1_id=$2 AND player2_id=$1)`;
        let value = [msg.author.id, user.id];
        clientdb.query(text, value, (err, res) => {
          if (err) console.log(err);
        });
      }
    });
    let txt = `SELECT * FROM records WHERE EXISTS(SELECT * FROM records WHERE player1_id=$1 AND player2_id=$2)`;
    let values = [msg.author.id, user.id];
    clientdb.query(txt, values, (err, res) => {
      console.log(res);
      if (err) console.log(err);
      if (res.rows.length <= 0) {
        console.log("im here");
        let textUser = `INSERT INTO users(id) VALUES ($1)`;
        let valuess = [msg.author.id];
        clientdb.query(textUser, valuess, (err, res) => {
          if (err) console.log(err);
        });
        textUser = `INSERT INTO users(id) VALUES ($1)`;
        values = [user.id];
        clientdb.query(textUser, values, (err, res) => {
          if (err) console.log(err);
        });
        let text = `INSERT INTO records(player1_id,player2_id,player1_wins,player2_wins) VALUES ($1,$2,$3,$4)`;
        let value = [msg.author.id, user.id, 0, 0];
        clientdb.query(text, value, (err, res) => {
          if (err) console.log(err);
        });
      }
    });
  } else {
    console.log("not working yet");
  }
};

//wins
// wins @player
// add w @player
// add 5 w @player
// add(5,w)

const printTotalWins = (mention, msg) => {
  if (!msg.mention) {
    msg.channel.send("Must mention someone to check total wins");
    return;
  }
  let ids = [];

  mention.users.each((user) => {
    ids.push(user.id);
  });

  if (ids.length === 2) {
    const text =
      "SELECT * FROM records WHERE (player1_id=$1 OR player1_id=$2) AND (player2_id=$2 OR player2_id=$1)";

    const values = [ids[0], ids[1]];

    clientdb.query(text, values, (err, res) => {
      if (res === undefined || res.rows.length === 0)
        return msg.channel.send(`<@${ids[0]}> OR <@${ids[1]}> Has no data`);
      msg.channel.send(
        `<@${res.rows[0].player1_id}> W: ${res.rows[0].player1_wins} <@${res.rows[0].player2_id}> W: ${res.rows[0].player2_wins}`
      );
      if (err) console.log(err);
    });
  } else if (ids.length === 1) {
    const text = "SELECT * FROM records WHERE (player1_id=$1 OR player2_id=$1)";
    const values = [ids[0]];
    clientdb.query(text, values, (err, res) => {
      let totalWins = 0;
      if (res === undefined || res.rows.length === 0)
        return msg.channel.send(`<@${ids[0]}>` + "Has no data");
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

client.on("message", (msg) => {
  if (!msg.content.startsWith("!") || msg.author.bot) return;

  let message = msg.content;
  const args = message.slice(1).trim().split(" ");

  const commandName = args.shift().toLowerCase();

  if (commandName === "wins") {
    if (msg.mentions.length > 1) return "err";
    //mention === msg.mentions

    printTotalWins(msg.mentions, msg);
  }

  if (commandName === "addw") {
    addToWins(msg);
  }
  //Check Win Command
  if (commandName === "cwins") {
    checkWins(msg);
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
