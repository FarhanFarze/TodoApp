const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./controllers/authController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
// Detailed MongoDB connection logging
const connectionOptions = {
  serverSelectionTimeoutMS: 10000,
  retryWrites: true,
  // Uncomment if you want to specify a specific database
  // dbName: 'your_database_name'
};

// URL encode the connection string to handle special characters
function encodeMongoURI(uri) {
  try {
    const parsedUrl = new URL(uri);
    const username = decodeURIComponent(parsedUrl.username);
    const password = decodeURIComponent(parsedUrl.password);
    
    // Re-encode username and password
    parsedUrl.username = encodeURIComponent(username);
    parsedUrl.password = encodeURIComponent(password);
    
    return parsedUrl.toString();
  } catch (error) {
    console.error('❌ Error encoding MongoDB URI:', error);
    return uri;
  }
}

// Forcibly use MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || !MONGODB_URI.startsWith('mongodb+srv://')) {
  console.error('❌ ERROR: Invalid MongoDB connection string');
  console.error('Please ensure you are using a valid MongoDB Atlas connection string');
  console.error('Connection string must start with mongodb+srv://');
  process.exit(1);
}

// Remove any default localhost connection
mongoose.set('strictQuery', true);

console.log('🔍 Attempting to connect to MongoDB Atlas...');
console.log('📡 Connection URI:', MONGODB_URI.replace(/:[^:]*@/, ':****@'));

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4 // Force IPv4
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`🌐 Connected to database: ${mongoose.connection.db.databaseName}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error Details:');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Error Code:', err.code);
    console.error('Full Error:', err);
    console.error('\n❗ Troubleshooting Tips:');
    console.error('1. Check your connection string');
    console.error('2. Verify network access in MongoDB Atlas');
    console.error('3. Ensure your IP is whitelisted');
    console.error('4. Check username and password');
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', protect, todoRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
