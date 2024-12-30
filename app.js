// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/attendanceDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Devotee Schema
const devoteeSchema = new mongoose.Schema({
    serialNumber: Number,
    name: String,
    address: String,
    position: { type: String, enum: ['Devotee', 'Karyakar'] },
    contactNumber: String,
});

// Create Devotee Model
const Devotee = mongoose.model('Devotee', devoteeSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Fetch all Devotees
app.get('/devotees', async (req, res) => {
    try {
        const devotees = await Devotee.find({});
        res.json(devotees);
    } catch (error) {
        res.status(500).send('Error fetching devotees');
    }
});

// Mark Attendance Route
app.post('/mark-attendance', async (req, res) => {
    const { serialNumber, date } = req.body;
    // Logic to mark attendance in the database
    try {
        // Assuming you have an Attendance model, you would save the attendance record here
        // const newAttendance = new Attendance({ serialNumber, date });
        // await newAttendance.save();

        // For now, just sending a response
        res.send(`Attendance marked for Serial Number: ${serialNumber} on ${date}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
