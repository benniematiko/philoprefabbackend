const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getItems, createItem, deleteItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Keep file in memory for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Public route – anyone can see the items
router.get('/', getItems);

// Protected route – only logged-in admin can upload
// protect MUST come before upload so we don't upload if not authorized
router.post('/', protect, upload.single('image'), createItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;