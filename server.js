const express = require('express');
require('dotenv').config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const profileRoute = require('./routes/profileRoute');

const app = express();
const PORT = process.env.PORT || 1818;

connectDB();

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/auth', userRoutes);
app.use('/', profileRoute);
app.use('/profile', profileRoute);

app.listen(PORT, () => {
    console.log(`Server running on "http://localhost:${PORT}"`);
});
