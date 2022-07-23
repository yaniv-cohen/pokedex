import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
const { Client } = require('pg');

const app: Express = express();
app.use(cors());
app.use(json());
const root: string = path.join(process.cwd(), 'dist');

app.use(express.static(root));

const client = new Client({
  connectionString: "postgres://gkaoyfejproxhy:0dcd62e62be969e6f01390e6be47f95166d4229ff8598f39a8412a999e74d70e@ec2-52-204-157-26.compute-1.amazonaws.com:5432/d5unf3bh4crl3",
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Hosted: http://localhost:' + port);
});

app.get('/get', (_request: any, response: any) => {
  client.query('SELECT * FROM pokemoAndFuisionsEntries', (err: Error, res: any) => {
    if (err) throw err;
    response.status(200).json(res.rows);
  });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});