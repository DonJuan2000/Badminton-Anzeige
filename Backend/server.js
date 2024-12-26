const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;



let saetze = [[0,0]];
//let teams = [[""],[""]];
let heim_team = ["Julian", "Jannis"];
let gast_team = ["Jasmin", "Rino"];

// Middleware
app.use(cors());

const clients_s = [];
const clients_t = [];

// SSE Endpoint
app.get('/SSE_spielstand', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Add client to subscribers
  clients_s.push(res);
  console.log('New client connected to Spielstand SSE');

  // Send initial data
  res.write(`data: ${JSON.stringify(saetze)}\n\n`);

  // Remove client on disconnect
  req.on('close', () => {
      clients_s.splice(clients_s.indexOf(res), 1);
      console.log('Spielstand SSE Client disconnected');
  });
});

app.get('/teams', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Add client to subscribers
  clients_t.push(res);
  console.log('New client connected to teams SSE');

  // Send initial data
  res.write(`data: ${JSON.stringify(teams)}\n\n`);

  // Remove client on disconnect
  req.on('close', () => {
    clients_t.splice(clients_t.indexOf(res), 1);
      console.log('Teams SSE Client disconnected');
  });
});

// Function to broadcast updates
function broadcastUpdate() {
  const data = JSON.stringify(saetze);
  clients_s.forEach((client) => {
      client.write(`data: ${data}\n\n`);
  });
}

function broadcastUpdate_teams() {
  const data = JSON.stringify(teams);
  clients_t.forEach((client) => {
      client.write(`data: ${data}\n\n`);
  });
}

app.get('/get_spielstand', (req, res) => {
  res.send(saetze);
});

app.get('/get_team_names', (req, res) => {
  let data = {"heim_team": heim_team, "gast_team": gast_team};
  data = JSON.stringify(data);
  console.log(data);
  res.send(data);
});

// Endpoint to update the array
app.post('/update_spielstand', express.json(), (req, res) => {
  const newSaetze = req.body.spielstand;
  if (Array.isArray(newSaetze)) {
      saetze = newSaetze;
      broadcastUpdate(); // Notify all clients
      res.status(200).send({ message: 'Array updated successfully' });
  } else {
      res.status(400).send({ error: 'Invalid data format' });
  }
});

// Endpoint to update the array
app.post('/update_teams', express.json(), (req, res) => {
  const new_teams = req.body.teams
  if (Array.isArray(new_teams)) {
    teams = new_teams;
    broadcastUpdate_teams(); // Notify all clients
    res.status(200).send({ message: 'Array updated successfully' });
  } else {
    res.status(400).send({ error: 'Invalid data format' });
  }
});


// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


