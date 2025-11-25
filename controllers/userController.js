const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const Secret_key = process.env.JWT_SECRET;
const Refresh_key = process.env.REFRESH_SECRET;
const JWT_Access_Expiry = process.env.JWT_ACCESS_EXPIRES_IN;
const JWT_Refresh_Expiry = process.env.JWT_REFRESH_EXPIRES_IN;

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already registered with this email Id, Please try again with different email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            bio: null,
            avatarUrl: null,
            refreshToken: null
        })

        const responseData = ({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            avatarUrl: newUser.avatarUrl

        })

        const token = await jwt.sign(
            { id: newUser._id },
            Secret_key,
            { expiresIn: JWT_Access_Expiry}
        );

        await newUser.save();
        res.status(201).json({ message: "User registered Successfully!!!", user: responseData, token });

    } catch (error) {
        res.status(500).json({ message: "Server error!", error: error.message });
    }
}



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found!!!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password!!!" });
        }

        const token = await jwt.sign(
            { id: user._id },
            Secret_key,
            { expiresIn: JWT_Access_Expiry }
        );

        const refreshToken = await jwt.sign(
            { id: user._id },
            Refresh_key,
            {expiresIn: JWT_Refresh_Expiry}
        );

        user.refreshToken = refreshToken;
        await user.save();

        const responseData = ({
            id: user._id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl

        });

        res.json({ message: "User Logged in successfylly", user: responseData, Access_Token: token, Refresh_token: refreshToken });

    } catch (error) {
        res.status(500).json({ message: "Server error!", error: error.message });
    }
}



exports.refresh = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh Token required" });
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
        return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    try {
        const decoded = jwt.verify(refreshToken, Refresh_key);

        const newAccessToken = jwt.sign(
            { id: decoded._id },
            Secret_key,
            { expiresIn: JWT_Access_Expiry }
        );

        const newRefreshToken = await jwt.sign(
            { id: user._id },
            Refresh_key,
            {expiresIn: JWT_Refresh_Expiry}
        );

        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({ New_Access_Token: newAccessToken, New_Refresh_Token: newRefreshToken });

    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
}



exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("_id name email bio avatarUrl");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

