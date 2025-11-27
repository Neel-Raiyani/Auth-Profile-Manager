const express = require('express');
const router = express.Router();
const {profile, updateProfile, changepassword, avatar} = require('../controllers/profilecontroller');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/profile', auth, profile);

router.put('/profile', auth, updateProfile);

router.put('/change-password', auth, changepassword);

router.put('/avatar', auth, upload.single('avatar'), avatar);

module.exports = router;
