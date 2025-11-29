import express from "express";
import "dotenv/config"
import path from "path";
import { fileURLToPath } from 'url';

import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 1818;

connectDB();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth', userRoutes);
app.use('/', profileRoutes);
app.use('/profile', profileRoutes);

app.listen(PORT, () => {
    console.log(`Server running on "http://localhost:${PORT}"`);
});
