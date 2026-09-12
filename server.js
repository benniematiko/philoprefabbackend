require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');   // ← new
const itemRoutes = require('./routes/itemRoutes');

const authRoutes = require('./routes/authRoutes');



const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running successfully!');
});

connectDB();   // ← new

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});