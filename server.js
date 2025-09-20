const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Simple middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourism_db';

mongoose.connect(mongoUrl, {})
.then(() => {
    console.log("Database Connected!!");
})
.catch((error) => {
    console.log("❌ Database connection failed:", error.message);
    console.log("⚠️  Server will continue running without database");
});

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("Database Connected!!");
});

// Simple health check
app.get('/health', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// API Routes (to be added)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});