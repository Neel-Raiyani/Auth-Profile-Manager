import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
import { signJwt } from "../utils/jwt.js";
dotenv.config()

const Secret_key = process.env.JWT_SECRET!;
const Refresh_key = process.env.REFRESH_SECRET!;

interface JwtPayloadType extends JwtPayload {
    id: string;
};

export const register = async (req: Request, res: Response) => {
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

        const token = await signJwt(
            { id: newUser._id.toString() },
            Secret_key,
            { expiresIn: "15m" }
        );

        await newUser.save();
        res.status(201).json({ message: "User registered Successfully!!!", user: responseData, token });

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Server error!", error: error.message });
        } else {
            res.status(500).json({ message: "Server error!", error: String(error) });
        }
    }
}



export const login = async (req: Request, res: Response) => {
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

        const token = await signJwt(
            { id: user._id.toString() },
            Secret_key,
            { expiresIn: "15m" }
        );

        const refreshToken = await signJwt(
            { id: user._id.toString() },
            Refresh_key,
            { expiresIn: "1d" }
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
        if (error instanceof Error) {
            res.status(500).json({ message: "Server error!", error: error.message });
        } else {
            res.status(500).json({ message: "Server error!", error: String(error) });
        }
    }
}



export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh Token required" });
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
        return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    try {
        const decoded = jwt.verify(refreshToken, Refresh_key) as JwtPayloadType;

        const newAccessToken = await signJwt(
            { id: decoded.id.toString() } as JwtPayloadType,
            Secret_key,
            { expiresIn: "15m" }
        );

        const newRefreshToken = await signJwt(
            { id: user._id.toString() } as JwtPayloadType,
            Refresh_key,
            { expiresIn: "1d" }
        );

        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({ New_Access_Token: newAccessToken, New_Refresh_Token: newRefreshToken });

    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
}



export const getUser = async (req: Request, res: Response) => {
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






