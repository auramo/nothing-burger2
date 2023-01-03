import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express()
const port = process.env.PORT || 8080

app.use(cors({
  origin: '*'
}));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.get('/api/hello', (req: Request, res: Response) => {
  res.send('{"a": 1}')
})


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})
