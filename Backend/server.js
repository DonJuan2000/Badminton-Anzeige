import express, { json } from 'express';
import cors from 'cors';
const app = express();
const PORT = 3000;

/**
 * @typedef {Object} Game
 * @property {Array<Array<number>>} saetze
 * @property {Array<number>} current_set
 * @property {Array<string>} left_team
 * @property {Array<string>} right_team
 * @property {string} last_point
 * @property {Array<number>} old_satz
 * @property {number} aufschlag
 * @property {Array<number>} team_mapping
 * @property {game_started} boolean
 */
const game = {
  saetze: [[0, 0]],
  current_set: [0, 0],
  left_team: ["", ""],
  right_team: ["", ""],
  last_point: "None",
  old_satz: [0, 0],
  aufschlag: 0,
  team_mapping: [0, 1],
  game_started: false
};

// Middleware
app.use(cors());

const clients_s = [];
const clients_t = [];

// SSE Endpoints
app.get('/SSE_spielstand', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Add client to subscribers
  clients_s.push(res);
  console.log('New client connected to Spielstand SSE');

  // Send initial data
  res.write(`data: ${JSON.stringify(game.saetze)}\n\n`);

  // Remove client on disconnect
  req.on('close', () => {
      clients_s.splice(clients_s.indexOf(res), 1);
      console.log('Spielstand SSE Client disconnected');
  });
});

app.get('/SSE_teams', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Add client to subscribers
  clients_t.push(res);
  console.log('New client connected to teams SSE');

  // Send initial data
  res.write(`data: ${JSON.stringify({"left_team": game.left_team, "right_team": game.right_team})}\n\n`);

  // Remove client on disconnect
  req.on('close', () => {
    clients_t.splice(clients_t.indexOf(res), 1);
      console.log('Teams SSE Client disconnected');
  });
});

// Functions to broadcast updates using SSE
function broadcastUpdate() {
  const data = JSON.stringify(game.saetze);
  clients_s.forEach((client) => {
      client.write(`data: ${data}\n\n`);
  });
}

function broadcastUpdate_teams() {
  const data = JSON.stringify({"left_team": game.left_team, "right_team": game.right_team});
  clients_t.forEach((client) => {
      client.write(`data: ${data}\n\n`);
  });
}

app.get('/Controler_mount', (req, res) => {
  const data = JSON.stringify(game);
  res.send(data);
});

app.post('/update_teams', json(), (req, res) => {
  const new_teams = req.body.teams
  if (Array.isArray(new_teams)) {
    game.left_team = new_teams[0][0];
    game.right_team = new_teams[1][0]
    broadcastUpdate_teams(); // Notify all clients
    res.status(200).send({ message: 'Array updated successfully' });
  } else {
    res.status(400).send({ error: 'Invalid data format' });
  }
});

app.post('/new_game', json(), (req, res) => {
  console.log(req.body);
  game.left_team = req.body.teams[0][0];
  game.right_team = req.body.teams[1][0];
  game.saetze = [[0,0]];
  game.current_set = [0,0];
  game.last_point = -1;
  game.old_satz = [0,0];
  game.game_started = true;
  broadcastUpdate_teams();
  broadcastUpdate();
  res.sendStatus(200);
});


function update_spielstand(team,update){
  let score_left_team = game.current_set[0];
  let score_right_team = game.current_set[1];
  let start_new_game = false;
  let switch_team = false;

  if (team === "left") {
    score_left_team += update;
    if (score_left_team >= 21 && (score_left_team-score_right_team >=2) || score_left_team == 30) {
      start_new_game = true;   
    }
    if (game.last_point == "left") {
      switch_team = "left";
    }
    game.last_point = "left";
  } else {
    score_right_team += update;
    if (score_right_team >= 21 && (score_right_team-score_left_team >=2) || score_right_team == 30) {
      start_new_game = true;
    }
    if (game.last_point == "right") {
      switch_team = "right";
    }
    game.last_point = "right";
  }

  const new_satz = [score_left_team,score_right_team];
  game.saetze.pop();
  game.saetze.push(new_satz);

  if (start_new_game) {
    game.saetze.push([0,0]);
    game.old_satz = [0,0];
    game.current_set = [0,0];
  } else {
    game.current_set = new_satz;
  }
}

app.post('/test_update', json(), (req, res) => {
  const team = req.body.team;
  const update = req.body.update;

  if (team === "left") {
    update_spielstand(team,update);
  } else {  
    update_spielstand(team,update);
  }
  broadcastUpdate();

  // TODO
  res.send({message: game.current_set,
            
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


