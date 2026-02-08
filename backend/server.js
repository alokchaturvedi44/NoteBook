const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const notesRoute = require("./routes/notes");
const bookmarkRoute = require("./routes/bookmarks");
const authRoute = require("./routes/auth");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-bookmarks');
        console.log('mongodb connected');
    }
    catch (error) {
        console.error('mongodb connection error:', error.message);
        process.exit(1);
    }
};

connectDB();


app.use("/api/notes", notesRoute);
app.use("/api/bookmarks", bookmarkRoute);
app.use("/api/auth", authRoute);

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: "Server is running"
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 2600;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;