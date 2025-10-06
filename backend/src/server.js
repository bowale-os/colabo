require('dotenv').config(); // Loads env variables (MONGODB_URL, PORT, etc.)

const app = require('./app'); // Import your Express app
const connectDB = require('./config/db'); // MongoDB connect function
// const config = require('./config/config'); // Your config.js (if you use one)

connectDB();

const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})