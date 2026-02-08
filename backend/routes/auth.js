const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {requireAuth} = require("../middleware/auth");



const generateToken= (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});
};

// register new user
router.post("/register", async (req, res) => {
    try{
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Please fill the required fields"
            });
        }

        const existingUser = await User.findOne({$or: [{email}, {username}]});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists!"
            });
        }

        // create user
        const user = await User.create({username, email, password});

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            }
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// login
router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // check password
        const checkPass = await user.comparePassword(password);
        if(!checkPass){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            }
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/me", requireAuth, async (req, res) => {
    try {
        res.status(200).json({
        success: true,
        data: {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email
        }
        });
    } 
    catch(error) {
        res.status(500).json({
        success: false,
        message: error.message
        });
    }
});

module.exports = router;