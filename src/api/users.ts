import { Router } from 'express';
import Joi from 'joi';
import { checkJwt } from '../middleware/auth';
import { Request as JWTRequest } from 'express-jwt';

//Define models
const userSchema = Joi.object({
	id: Joi.string().required(),
	name: Joi.string().required().min(1).max(255),
	status: Joi.boolean(),
	role: Joi.boolean(),
}).required();

const router = Router();

//checks for auth0 authentication
router.use(checkJwt);

//Checks if user is new, if it's already in the db
router.get('/auth/:id', async (req: JWTRequest, res) => {
	//only returns the user if they are requesting themselves
	if (req.auth?.sub === req.params.id) {
		const user = await req.prisma.users.findUnique({
			where: {
				id: req.params.id,
			},
		});
		res.json(user);
	} else {
		res.sendStatus(401);
	}
});

//Creates a new user
router.post('/auth', async (req: JWTRequest, res) => {
	//only allows the new user to create for itself
	if (req.auth?.sub === req.body.id) {
		try {
			const data = await userSchema.validateAsync(req.body);
			const user = await req.prisma.users.create({ data });
			res.json(user);
		} catch (error) {
			return res.sendStatus(400);
		}
	} else {
		res.sendStatus(401);
	}
});

export default router;
