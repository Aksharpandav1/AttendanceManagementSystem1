const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Handle deprecation warnings
mongoose.set('strictQuery', false);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views')); 

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/attendance_system', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Routes
try {
    app.use('/', require('./src/routes/index'));
    app.use('/auth', require('./src/routes/auth'));
    app.use('/devotee', require('./src/routes/devotee'));
    app.use('/attendance', require('./src/routes/attendance'));
} catch (error) {
    console.error('Error loading routes:', error);
    process.exit(1);
}

// Basic test route
app.get('/test', (req, res) => {
    res.send('Server is running');
});

const PORT = process.env.PORT || 3888;

// Add error handling for port conflicts
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use. Please try another port.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app; // Add this line to export the app
