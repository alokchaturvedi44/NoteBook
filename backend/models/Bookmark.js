const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    url: {
      type: String,
      required: [true, 'URL is required'],
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid URL starting with http:// or https://'
      }
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    tags: [{
      type: String,
      trim: true
    }],
    isFav: {
      type: Boolean,
      default: false
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false 
    }
  }, 
  {
    timestamps: true
  }
);

bookmarkSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('BookMark', bookmarkSchema);
