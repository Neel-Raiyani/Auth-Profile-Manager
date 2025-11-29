import express from "express";
const router = express.Router();
import {profile, updateProfile, changepassword, avatar} from "../controllers/profilecontroller.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

router.get('/profile', auth, profile);

router.put('/profile', auth, updateProfile);

router.put('/change-password', auth, changepassword);

router.put('/avatar', auth, upload.single('avatar'), avatar);

export default router;
