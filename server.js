const express = require('express');
require('dotenv').config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 1818;

connectDB();

app.use(express.json());

app.use('/auth', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on "http://localhost:${PORT}"`);
});
