const Item = require('../models/Item');
const cloudinary = require('../config/cloudinary');

// Get all items
const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items', error: error.message });
  }
};

// Create item
const createItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'name, price, and category are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Promise wrapper for upload_stream
    const uploadToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { 
            folder: 'fabricated-items',
            resource_type: 'image',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(buffer);
      });
    };

    const result = await uploadToCloudinary(req.file.buffer);

    const item = await Item.create({
      name: name.trim(),
      description,
      price: Number(price),
      category,
      image: result.secure_url,
      cloudinary_id: result.public_id // IMPORTANT: save this
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Failed to create item', error: error.message });
  }
};

// You'll want this next - delete with cleanup
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.cloudinary_id) {
      await cloudinary.uploader.destroy(item.cloudinary_id);
    }
    
    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem
};