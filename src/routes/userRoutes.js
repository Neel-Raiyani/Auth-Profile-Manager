const express = require('express');
const router = express.Router();
const {register, login, refresh, getUser} = require('../controllers/userController');
const validate  = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const {body} = require('express-validator');

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

module.exports = router;
