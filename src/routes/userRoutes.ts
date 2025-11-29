import express from "express"
const router = express.Router();
import {register, login, refresh, getUser} from "../controllers/userController.js";
import validate from "../middlewares/validation.js";
import auth from "../middlewares/auth.js";
import {body} from "express-validator";

router.post('/register', [
    body('name').notEmpty().withMessage("Name is required"),
    body('email').isEmail().withMessage("Enter valid Email"),
    body('password').isLength({min: 6,max: 8}).withMessage("Password must be of length 6 to 8")
], validate, register);

router.post('/login', [
    body('email').isEmail().withMessage("Enter valid Email"),
    body('password').isLength({min: 6,max: 8}).withMessage("Password must be of length 6 to 8")
], validate, login);

router.post('/refresh', refresh);

router.get('/me', auth, getUser);

export default router;
