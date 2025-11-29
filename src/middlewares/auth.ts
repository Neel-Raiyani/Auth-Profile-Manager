import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const Secret_key = process.env.JWT_SECRET;

const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }
        const decoded = jwt.verify(token, Secret_key!) as jwt.JwtPayload;

        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export default auth;