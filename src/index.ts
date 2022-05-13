import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler } from './middleware/handlers';
import { PrismaClient } from '@prisma/client';
import userRouter from './api/users';

declare global {
	namespace Express {
		interface Request {
			prisma: PrismaClient;
		}
	}
}
dotenv.config();

//enables CORS in dev server
const corsOptions = {
	origin: process.env.URL,
};

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors(corsOptions));

app.use(errorHandler);

//database connection
app.use((req: Request, res: Response, next: NextFunction) => {
	req.prisma = new PrismaClient();

	//terminate db connection on end of request
	res.once('finish', () => req.prisma.$disconnect());
	next();
});

app.use('/user', userRouter);

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
