const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on "http://localhost:${PORT}"`);
});
