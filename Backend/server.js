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
 * @property {boolean} heim_left
 * @property {boolean} game_started
 * @property {boolean} third_set_switch
 * @property {Array<number>} heim_seite
 * @property {number} spielart
 */
const game = {
  saetze: [[0, 0]],
  current_set: [0, 0],
  left_team: ["", ""],
  right_team: ["", ""],
  last_point: "None",
  old_satz: [0, 0],
  aufschlag: 0,
  heim_left: true,
  game_started: false,
  third_set_switch: false,
  heim_seite: [],
  spielart: 0
};

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));

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
  res.write(`data: ${JSON.stringify({"saetze": game.saetze, "heim_left": game.heim_left, "heim_seite": game.heim_seite, "aufschlag": game.aufschlag})}\n\n`);

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
  const data = JSON.stringify({"saetze": game.saetze, "heim_left": game.heim_left, "heim_seite": game.heim_seite, "aufschlag": game.aufschlag});
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
  const update = req.body.update
  if (update == 'left') {
    game.left_team = [game.left_team[1], game.left_team[0]];
  }else if (update == 'right') {
      game.right_team = [game.right_team[1], game.right_team[0]];
  }else if (update == 'teams') {
      const temp = game.right_team;
      game.right_team = game.left_team;
      game.left_team = temp;
      game.heim_left = !game.heim_left;
      const _temp = game.heim_seite.pop()
      game.heim_seite.push(!_temp);
  }
  broadcastUpdate_teams(); // Notify all clients
  res.status(200).send({ message: 'Array updated successfully' });
});

app.post('/new_game', json(), (req, res) => {
  game.left_team = req.body.teams[0][0];
  game.right_team = req.body.teams[1][0];
  game.aufschlag = req.body.aufschlag;
  game.saetze = [[0,0]];
  game.current_set = [0,0];
  game.last_point = -1;
  game.old_satz = [0,0];
  game.game_started = true;
  game.heim_left = req.body.heim_left;
  game.heim_seite = [];
  game.spielart = req.body.spielart;
  // Heimmanschaft links -> 0
  // Heimmanschaft rechts -> 1
  broadcastUpdate_teams();
  broadcastUpdate();
  res.sendStatus(200);
});

function update_spielstand_einzel(team,update){
  let score_left_team = game.current_set[0];
  let score_right_team = game.current_set[1];
  let start_new_game = false;
  // switch_action = -1 -> no switch
  // switch_action = "1" -> switch left team
  // switch_action = "2" -> switch right team
  // switch_action = "0" -> switch both teams
  let switch_action = -1;

  if (score_left_team == 0 && score_right_team == 0) {
    if (game.heim_left == true) {
      game.heim_seite.push(0);
    } else {
      game.heim_seite.push(1);
    }
  }

  if (team === "left") {
    score_left_team += update;
    if (score_left_team >= 21 && (score_left_team-score_right_team >=2) || score_left_team == 30) {
      switch_action = 0;
      start_new_game = true;
    }
  } else {
    score_right_team += update;
    if (score_right_team >= 21 && (score_right_team-score_left_team >=2) || score_right_team == 30) {
      switch_action = 0;
      start_new_game = true;
    }
  }

  if (team === "left") {
    if (score_left_team % 2 == 0) {
      if (game.left_team[0] != '') {
        const top_player = game.left_team[0];
        game.left_team[0] = game.left_team[1];
        game.left_team[1] = top_player;
      }
      if (game.right_team[1] != '') {
        const top_player = game.right_team[0];
        game.right_team[0] = game.right_team[1];
        game.right_team[1] = top_player;
      }
    } else {
      if (game.left_team[1] != '') {
        const top_player = game.left_team[0];
        game.left_team[0] = game.left_team[1];
        game.left_team[1] = top_player;
      }
      if (game.right_team[0] != '') {
        const top_player = game.right_team[0];
        game.right_team[0] = game.right_team[1];
        game.right_team[1] = top_player;
      }
    }
  } else {
    if (score_right_team % 2 == 0) {
      if (game.left_team[0] != '') {
        const top_player = game.left_team[0];
        game.left_team[0] = game.left_team[1];
        game.left_team[1] = top_player;
      }
      if (game.right_team[1] != '') {
        const top_player = game.right_team[0];
        game.right_team[0] = game.right_team[1];
        game.right_team[1] = top_player;
      }
    } else {
      if (game.left_team[1] != '') {
        const top_player = game.left_team[0];
        game.left_team[0] = game.left_team[1];
        game.left_team[1] = top_player;
      }
      if (game.right_team[0] != '') {
        const top_player = game.right_team[0];
        game.right_team[0] = game.right_team[1];
        game.right_team[1] = top_player;
      }
    }
  }

  if (switch_action == 1) {
    const top_player = game.left_team[0];
    game.left_team[0] = game.left_team[1];
    game.left_team[1] = top_player;
  } else if (switch_action == 2) {
    const top_player = game.right_team[0];
    game.right_team[0] = game.right_team[1];
    game.right_team[1] = top_player;
  } else if (switch_action == 0) {
    const temp_left_team = game.left_team;
    game.left_team = game.right_team;
    game.right_team = temp_left_team;
    game.heim_left = !game.heim_left;
  }

  let new_satz = [score_left_team,score_right_team];

  game.saetze.pop();
  game.saetze.push(new_satz);

  if (start_new_game) {
    game.saetze.push([0,0]);
    game.old_satz = [0,0];
    game.current_set = [0,0];
  } else {
    game.current_set = new_satz;
  }

  if (team == "left") {
    game.aufschlag = game.current_set[0] % 2 === 0 ? 0 : 1;
  } else {
    game.aufschlag = game.current_set[1] % 2 === 0 ? 2 : 3;
  }

  // Dritter Satz und noch nicht gewechselt und einer 11 Punkte
  if (game.saetze.length == 3 && game.third_set_switch == false && (game.current_set[0] == 11 || game.current_set[1] == 11)) {
    game.third_set_switch = true;
    const temp_left_team = game.left_team;
    game.left_team = game.right_team;
    game.right_team = temp_left_team;
    game.heim_left = !game.heim_left;
    game.current_set = [game.current_set[1],game.current_set[0]];

    const current_set = game.saetze.pop();
    game.saetze.push([current_set[1],current_set[0]]);
    const temp_heim_seite = game.heim_seite;
    game.heim_seite.pop();
    game.heim_seite.push(!temp_heim_seite);
  }
}

function update_spielstand(team,update){
  let score_left_team = game.current_set[0];
  let score_right_team = game.current_set[1];
  let start_new_game = false;
  // switch_action = -1 -> no switch
  // switch_action = "1" -> switch left team
  // switch_action = "2" -> switch right team
  // switch_action = "0" -> switch both teams
  let switch_action = -1;

  if (score_left_team == 0 && score_right_team == 0) {
    if (game.heim_left == true) {
      game.heim_seite.push(0);
    } else {
      game.heim_seite.push(1);
    }
  }

  if (team === "left") {
    score_left_team += update;
    if (score_left_team >= 21 && (score_left_team-score_right_team >=2) || score_left_team == 30) {
      switch_action = 0;
      game.last_point == "right";
      start_new_game = true;
    } else { 
      if (game.last_point == "left") {
        switch_action = 1;
      }
    }
    game.last_point = "left";
  } else {
    score_right_team += update;
    if (score_right_team >= 21 && (score_right_team-score_left_team >=2) || score_right_team == 30) {
      switch_action = 0;
      game.last_point = "left";
      start_new_game = true;
    } else {
      if (game.last_point == "right") {
        switch_action = 2;
      }
    }
    game.last_point = "right";
  }

  if (switch_action === 1) {
    const top_player = game.left_team[0];
    game.left_team[0] = game.left_team[1];
    game.left_team[1] = top_player;
  } else if (switch_action === 2) {
    const top_player = game.right_team[0];
    game.right_team[0] = game.right_team[1];
    game.right_team[1] = top_player;
  } else if (switch_action === 0) {
    const temp_left_team = game.left_team;
    game.left_team = game.right_team;
    game.right_team = temp_left_team;
    game.heim_left = !game.heim_left;
  }

  let new_satz = [score_left_team,score_right_team];

  game.saetze.pop();
  game.saetze.push(new_satz);

  if (start_new_game) {
    game.saetze.push([0,0]);
    game.old_satz = [0,0];
    game.current_set = [0,0];
  } else {
    game.current_set = new_satz;
  }

  if (game.current_set[0] > game.old_satz[0]) {
    game.aufschlag = game.current_set[0] % 2 === 0 ? 0 : 1;
    game.old_satz = game.current_set;
  }
  if (game.current_set[1] > game.old_satz[1]) {
      game.aufschlag = game.current_set[1] % 2 === 0 ? 2 : 3;
      game.old_satz = game.current_set;
  }

  // Dritter Satz und noch nicht gewechselt und einer 11 Punkte
  if (game.saetze.length == 3 && game.third_set_switch == false && (game.current_set[0] == 11 || game.current_set[1] == 11)) {
    game.third_set_switch = true;
    const temp_left_team = game.left_team;
    game.left_team = game.right_team;
    game.right_team = temp_left_team;
    game.heim_left = !game.heim_left;
    game.current_set = [game.current_set[1],game.current_set[0]];

    const current_set = game.saetze.pop();
    game.saetze.push([current_set[1],current_set[0]]);
    const temp_heim_seite = game.heim_seite;
    game.heim_seite.pop();
    game.heim_seite.push(!temp_heim_seite);
  }
}



app.post('/test_update', json(), (req, res) => {
  const team = req.body.team;
  const update = req.body.update;

  if (game.spielart == 0){
    update_spielstand_einzel(team,update);
  }else{
    update_spielstand(team,update);
  }
  
  broadcastUpdate();
  broadcastUpdate_teams();
  // TODO
  res.status(200).json({ message: "OK" });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
