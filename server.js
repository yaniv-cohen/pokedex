
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { WebSocketServer } = require('ws');
const { log } = require('console');

const portHttp = 3000;
// const portWs = 4040;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const root = path.join(process.cwd(), 'dist');
app.use(express.static(root), (req, res, next) => {
  next();
});

const filePath = path.join(__dirname, "./database.json");
const readFileData = JSON.parse(fs.readFileSync(filePath, "utf8"));

app.get("/", (req, res) => {
  res.status(200).send(readFileData);
});


app.listen(4040, () => {console.log("listening on port 4040...");});


//request to get the database to the client
app.get('/pokemonsJSON', (req, res) => {
res.sendFile(path.join(root, '/database.json'));
});


app.get('*', (req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

app.listen(portHttp, () => {
  console.log('Hosted: http://localhost:' + portHttp);
});
