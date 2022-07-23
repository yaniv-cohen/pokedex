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
  connectionString: "postgres://hpdllyrhiontnd:b1167bc4d48d6b9ad649814f1dbbbfd572450cedb7ad7733070ce9e05e64c973@ec2-54-161-255-125.compute-1.amazonaws.com:5432/d6nt3n691ktte2",
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
  client.query('SELECT * FROM pokemonAndFusionsData', (err: Error, res: any) => {
    if (err) throw err;
    response.status(200).json(res.rows);
  });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});