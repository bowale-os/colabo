require('dotenv').config(); 
const connectDB = require('./config/db'); 
const app = require('./app');
// const config = require('./config/config'); // Your config.js (if you use one)
const httpServer = require('http').createServer(app);
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

connectDB();
const port = process.env.PORT || 3000;

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true
    }
});


// Socket authentication middleware
io.use( async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {

    return next(new Error("No token provided"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    socket.userId = decoded.userId;
    const user = await User.findById(decoded.userId);
    socket.userName = user.name; // If available in your JWT
    // Attach any other info needed
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    // Disconnects socket if authentication fails
    return next(new Error("Invalid or expired token"));
  }
});

// Handle connections/events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id, socket.userId, socket.userName);

  socket.on("user_connected", ({ name, email }) => {
    // You already know socket.userId from middleware
    console.log(`User ${name} (${email}) connected via event on socket ${socket.id}`);
    // Optionally: broadcast online status, etc.
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} (userId: ${socket.userId}) disconnected`);
    // Optionally mark user as offline
  });
});

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
