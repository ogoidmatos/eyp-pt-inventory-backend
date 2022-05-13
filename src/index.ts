import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

//enables CORS in dev server
const corsOptions = {
	origin: process.env.URL,
};

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!');
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
