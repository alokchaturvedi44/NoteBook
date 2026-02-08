const express = require("express");
const router = express.Router();
const Bookmark = require("../models/Bookmark");
const { fetchTitle } = require("../utils/fetchTitle");
const { protect } = require("../middleware/auth");


router.use(protect);

// CREATE
router.post("/", async (req, res) => {
    try {
        let { url, title, description, tags } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required"
            });
        }

        // Auto-fetch title
        if (!title || title.trim() === '') {
            try {
                title = await fetchTitle(url);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Title is required or URL must be accessible to auto-fetch title"
                });
            }
        }

        const bookmarkData = {
            url,
            title,
            description: description || '',
            tags: tags || []
        };

        if (req.user) {
            bookmarkData.userId = req.user._id;
        }

        const bookmark = await Bookmark.create(bookmarkData);

        res.status(201).json({
            success: true,
            data: bookmark
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET all
router.get("/", async (req, res) => {
    try {
        const {q, tags} = req.query;
        let query = {};

        if(req.user){
            query.userId = req.user._id;
        } 
        else{
            query.userId = null;
        }

        if(q){
            query.$text = { $search: q };
        }
        if(tags){
            const tagArray = tags.split(',').map(tag => tag.trim());
            query.tags = { $in: tagArray };
        }

        const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookmarks.length,
            data: bookmarks
        });
    } 
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET single bookmark by ID
router.get("/:id", async (req, res) => {
    try {
        const bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: "Bookmark not found"
            });
        }

        // Check authorization
        if (bookmark.userId && (!req.user || bookmark.userId.toString() !== req.user._id.toString())) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this bookmark'
            });
        }

        res.status(200).json({
            success: true,
            data: bookmark
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// UPDATE bookmark
router.put("/:id", async (req, res) => {
    try {
        let bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found'
            });
        }

        // Check authorization
        if (bookmark.userId && (!req.user || bookmark.userId.toString() !== req.user._id.toString())) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this bookmark'
            });
        }

        const { url, title, description, tags, isFavorite } = req.body;

        bookmark = await Bookmark.findByIdAndUpdate(
            req.params.id,
            { url, title, description, tags, isFavorite },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: bookmark
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// DELETE bookmark
router.delete("/:id", async (req, res) => {
    try {
        const bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found'
            });
        }

        // Check authorization
        if (bookmark.userId && (!req.user || bookmark.userId.toString() !== req.user._id.toString())) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this bookmark'
            });
        }

        await Bookmark.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Bookmark deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;