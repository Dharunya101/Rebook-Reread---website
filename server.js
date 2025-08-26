const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const port = 3018;
const cors = require('cors');

// Middleware to parse form data
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // Middleware to parse JSON data
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/fwd', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connection successful");
});

// Serve home page (home2.2.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home2.2.html'));
});

// Serve signup page (signup2.html)
app.get("/signup2", (req, res) => {
    res.sendFile(path.join(__dirname, "signup2.html"));
});

// Define user schema for MongoDB
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    phone: Number,
    password: String
});

// Create a model based on the user schema
const Users = mongoose.model("signupdetails", userSchema);

// Handle user form submission (POST request to /post)
app.post('/post', async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        // Create a new user document
        const user = new Users({
            username,
            email,
            phone,
            password
        });

        // Save the user to MongoDB
        await user.save();

        console.log("User saved:", user);
        res.send("Form submission successful!");
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send("Error during form submission.");
    }
});

// Serve resell page (Resell2.html)
app.get("/Resell2", (req, res) => {
    res.sendFile(path.join(__dirname, "Resell2.html"));
});

// Define resell schema for MongoDB
const resellSchema = new mongoose.Schema({
    bname: String,
    bauthor: String,
    bgenre: String,
    bcondn: String,
    bqty: Number,
    bpay: String
});

// Create a model based on the resell schema
const Resells = mongoose.model("reselldetails", resellSchema);

// Handle resell form submission (POST request to /post2)
app.post('/post2', async (req, res) => {
    try {
        const { bname, bauthor, bgenre, bcondn, bqty, bpay } = req.body;

        // Create a new resell document
        const resell = new Resells({
            bname, bauthor, bgenre, bcondn, bqty, bpay
        });

        // Save the resell details to MongoDB
        await resell.save();

        console.log("Resell details saved:", resell);
        res.send("Resell form submission successful!");
    } catch (error) {
        console.error("Error saving resell details:", error);
        res.status(500).send("Error during form submission.");
    }
});

// Fetch all resells (GET request to /resells)
app.get('/resells', async (req, res) => {
    try {
        const resells = await Resells.find();  // Fetch all resell items
        console.log(resells);  // Log fetched data
        res.status(200).json(resells);  // Send data as response
    } catch (error) {
        console.error("Error fetching resells:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete user by ID (DELETE request to /delete-user/:id)
app.delete('/delete-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await Users.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete resell book by ID (DELETE request to /delete-resell/:id)
app.delete('/delete-resell/:id', async (req, res) => {
    try {
        const resellId = req.params.id;
        const result = await Resells.findByIdAndDelete(resellId);

        if (!result) {
            return res.status(404).json({ message: "Resell book not found" });
        }

        res.status(200).json({ message: "Resell book deleted successfully" });
    } catch (error) {
        console.error("Error deleting resell book:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Update user by ID (PUT request to /update-user/:id)
app.put('/update-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, phone, password } = req.body;

        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            { username, email, phone, password },
            { new: true }  // Return the updated user document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Update resell book by ID (PUT request to /update-resell/:id)
app.put('/update-resell/:id', async (req, res) => {
    try {
        const resellId = req.params.id;
        const { bname, bauthor, bgenre, bcondn, bqty, bpay } = req.body;

        const updatedResell = await Resells.findByIdAndUpdate(
            resellId,
            { bname, bauthor, bgenre, bcondn, bqty, bpay },
            { new: true }  // Return the updated resell document
        );

        if (!updatedResell) {
            return res.status(404).json({ message: "Resell book not found" });
        }

        res.status(200).json(updatedResell);
    } catch (error) {
        console.error("Error updating resell book:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Start the server
app.listen(port, () => {
    console.log("Server started on port " + port);
});
