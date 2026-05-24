const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ==========================================
// 1. MONGODB CONNECTION
// ==========================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Compass successfully!"))
  .catch(err => console.error("Connection error:", err));

// ==========================================
// 2. SCHEMAS & MODELS
// ==========================================

const placeSchema = new mongoose.Schema({
    name: String,
    type: String, 
    location: String, 
    address: String,
    rating: Number,
    details: Object 
});

// Model for 'places' collection (Temples)
const Place = mongoose.model('Place', placeSchema);

// NEW: Model for 'rooms' collection (Rooms)
// The third argument 'rooms' tells Mongoose to look for the collection named 'rooms'
const Room = mongoose.model('Room', placeSchema, 'rooms');
const Restaurant = mongoose.model('Restaurant', placeSchema, 'restaurants');

// Schema for Contact Messages
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// Schema for Users
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // unique prevents duplicate registrations
    password: { type: String, required: true },
    username: String
});
// This will automatically create a collection named 'users' in Compass
const User = mongoose.model('User', userSchema);
// ==========================================
// 3. API ROUTES
// ==========================================

// GET Route: Fetch temples/hotels from 'places' collection
app.get('/api/nearby', async (req, res) => {
    const { type } = req.query;
    try {
        const places = await Place.find({ type: type });
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data from database" });
    }
});

// NEW GET Route: Fetch rooms from the 'rooms' collection
app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: "Error fetching rooms collection" });
    }
});

app.get('/api/restaurants', async (req, res) => {
    try {
        const data = await Restaurant.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching restaurants" });
    }
});

// POST Route: Save Contact Form
app.post('/api/contact', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json({ message: "Success! Your message was saved." });
    } catch (error) {
        res.status(500).json({ error: "Failed to save contact message" });
    }
});

// POST Route: Register or Auth a user and save to database
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Check if the user already exists in the database
        let existingUser = await User.findOne({ email: email });
        
        if (existingUser) {
            // If they exist, check if the password matches (Simple Login)
            if (existingUser.password === password) {
                return res.status(200).json({ message: "Login successful!", username: existingUser.username || "User" });
            } else {
                return res.status(401).json({ error: "Invalid Password for this email!" });
            }
        }

        // 2. If it's a completely new email, create a username from the email prefix and save
        const customUsername = email.split('@')[0]; // e.g., 'addepallimanikanta4236'
        
        const newUser = new User({
            email: email,
            password: password,
            username: customUsername
        });

        await newUser.save();
        res.status(201).json({ message: "Account created and logged in successfully!", username: customUsername });

    } catch (error) {
        console.error("Signup/Login Error:", error);
        res.status(500).json({ error: "Authentication failed on server" });
    }
});

// ==========================================
// 4. SERVER START
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});