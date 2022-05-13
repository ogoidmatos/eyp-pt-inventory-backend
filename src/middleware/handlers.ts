import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';

export const errorHandler = (
	err: ErrorRequestHandler,
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!err) return next();

	console.error(err);
	res.sendStatus(500);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
	Promise.resolve(fn(req, res, next)).catch(next);
