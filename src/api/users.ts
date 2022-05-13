import { Router } from 'express';
import Joi from 'joi';

const router = Router();

//Define models
const userSchema = Joi.object({
	id: Joi.string().required(),
	name: Joi.string().required().min(1).max(255),
	status: Joi.boolean(),
	role: Joi.boolean(),
}).required();

//Checks if user is new, if it's already in the db
router.get('/auth/:id', async (req, res) => {
	//validation missing
	const user = await req.prisma.users.findUnique({
		where: {
			id: req.params.id,
		},
	});
	res.json(user);
});

//Creates a new user
router.post('/auth', async (req, res) => {
	let data;
	try {
		data = await userSchema.validateAsync(req.body);
	} catch (error) {
		return res.sendStatus(400);
	}
	const user = await req.prisma.users.create({ data });
	res.json(user);
});

export default router;
