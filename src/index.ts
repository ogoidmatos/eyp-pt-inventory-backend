import express, { Express, NextFunction, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Request as JWTRequest } from 'express-jwt';
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

const prisma = new PrismaClient();

app.use(express.json());
app.use(cors(corsOptions));

app.use(errorHandler);

//database connection
app.use((req: JWTRequest, res: Response, next: NextFunction) => {
	req.prisma = prisma;
	next();
});

app.use('/user', userRouter);

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
