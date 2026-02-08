const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const {protect} = require("../middleware/auth");

router.use(protect);


// create 
router.post("/", async (req, res) => {
    try{
        const {title, content, tags} = req.body;
        if(!title || !content){
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }
        const noteData = {
            title,
            content,
            tags: tags || []
        };
        if(req.user){
            noteData.userId = req.user._id;
        }
        
        const notes = await Note.create(noteData);

        res.status(201).json({
            success: true,
            data: notes
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// show all
router.get("/", async(req, res) => {
    try{
        const {q, tags} = req.query;
        let query = {};

        if (req.user) {
            query.userId = req.user._id;  
        } 
        else {
            query.userId = null; 
        }
        
        if(q){
            query.$text = { $search: q};
        }
        if(tags){
            const tarr = tags.split(',').map(tag => tag.trim());
            query.tags = { $in: tarr};
        }

        const note = await Note.find(query);
        note.sort((a, b) => b.createdAt - a.createdAt);
        
        res.status(200).json({
            success: true,
            count: note.length,
            data: note
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// show one
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({
            success: false,
            message: 'Note not found'
            });
        }

        // Check authorization
        if (note.userId && (!req.user || note.userId.toString() !== req.user._id.toString())) {
            return res.status(403).json({
            success: false,
            message: 'Not authorized to access this note'
            });
        }

        res.status(200).json({
            success: true,
            data: note
        });
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// update one
router.put('/:id', async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({
            success: false,
            message: 'Note not found'
            });
        }

        // Check authorization
        if (note.userId && (!req.user || note.userId.toString() !== req.user._id.toString())) {
            return res.status(403).json({
            success: false,
            message: 'Not authorized to update this note'
            });
        }

        const { title, content, tags, isFavorite } = req.body;

        note = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content, tags, isFavorite },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: note
        });
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// delete one
router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({
            success: false,
            message: 'Note not found'
            });
        }

        // Check authorization
        if (note.userId && (!req.user || note.userId.toString() !== req.user._id.toString())) {
            return res.status(403).json({
            success: false,
            message: 'Not authorized to delete this note'
            });
        }

        await Note.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Note deleted successfully'
        });
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;