const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const noteRoutes = require('./routes/note');
const collabRoutes = require('./routes/collab');

const app = express();

// Use Morgan for logging HTTP requests
app.use(morgan('dev')); // or 'combined', 'tiny', etc.
app.use(cors({
  origin: 'http://localhost:5173', // Only allow your React dev server
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type']
}));

app.use(express.json());
app.use(cookieParser()); // Parse cookies from requests

// Define your routes here...
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/note', noteRoutes);
app.use('/api/collab', collabRoutes); 

//health check
app.get('/', (req, res) => {
    res.send('API is running!')
});

//catch 404 errors
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

//other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});



module.exports = app;
