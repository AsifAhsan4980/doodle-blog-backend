import dotenv from 'dotenv'
dotenv.config({path: "./config.env"})
import connectDB from './config/db.js'

import app from './app.js'

connectDB().then(r => console.log("MongoDB connected"))

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () =>
    console.log(`Sever running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error: ${err.message}`);
    server.close(() => process.exit(1));
});