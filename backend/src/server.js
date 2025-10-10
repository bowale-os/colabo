require('dotenv').config(); // Loads env variables (MONGODB_URL, PORT, etc.)

const app = require('./app'); // Import your Express app
const connectDB = require('./config/db'); // MongoDB connect function
// const config = require('./config/config'); // Your config.js (if you use one)
const httpServer = require('http').createServer(app);
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // or wherever your User model is

connectDB();

const port = process.env.PORT || 3000;

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true
    }
});


const verifyToken = async (token) => {
  try {
    // Verify JWT signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded is", decoded);
    
    // Additional checks
    if (!decoded.userId) {
      return {"error":
        "Invalid token: missing userId"
        }
      };

    return {
      id: decoded.userId,
      // Add other user fields as needed
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      console.log('Invalid token');
    }
    console.error('Token verification error:', error);
    return ;
  }
};


// Your socket event handlers
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on("user_connected", async ({ userId, name, token }) => {
    try{
      const verified = await verifyToken(token);
      if (!verified) {
        socket.emit('auth-error', { message: 'Invalid or expired token' });
        return;
      }
      socket.userId = verified.userId;
      socket.userName = name;
      console.log(`User ${name} (${userId}) connected on socket ${socket.id} and verified`, verified);

    }catch (err){
      socket.emit('auth-error', { message: 'Authentication failed' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected
    `)
  });

});


httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})