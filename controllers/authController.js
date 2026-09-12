const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Helper function to create a VIP wristband (token)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'   // wristband is valid for 7 days
  });
};

// Register a new admin (we will use this only once)
const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if an admin with this email already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create the new admin
    const admin = await Admin.create({
      email,
      password
    });

    res.status(201).json({
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login an existing admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the admin by email
    const admin = await Admin.findOne({ email });

    // Check if admin exists and password is correct
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin
};