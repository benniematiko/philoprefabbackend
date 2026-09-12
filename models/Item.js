const mongoose = require('mongoose');

// This is the recipe card for one fabricated item
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,          // every item must have a name
    trim: true               // removes extra spaces
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,            // this will later hold the Cloudinary picture link
    required: true
  },
  cloudinary_id: { type: String, required: true },
  category: {
    type: String,
    required: true
  }
}, {
  timestamps: true           // automatically adds createdAt and updatedAt
});

// Create the model from the recipe card
const Item = mongoose.model('Item', itemSchema);

// Make it available to other files
module.exports = Item;