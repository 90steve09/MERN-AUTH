import express from express;
import {login, register,logout} from '../controllers/authController.js'


export const authRouter = express.Router();

authRouter.post('/resgister', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);