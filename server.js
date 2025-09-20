const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Simple middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

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

// API Routes
app.use('/api/users', require('./routes/userRoutes'));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    const status = err.status || 500;
    res.status(status).json({ success: false, message: err.message || 'Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});