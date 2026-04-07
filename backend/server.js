import express from "express";
//import routes
import CompileRoute from './routes/CompileRoute.js';
import ProblemListRoute from "./routes/ProblemListRoute.js";
import ProblemRoute from "./routes/ProblemRoute.js";
import SubmitRoute from "./routes/SubmitRoute.js";
import ContestRoute from "./routes/ContestRoute.js";

import cors from "cors";
import mongoose from "mongoose";
import { mongoDBURL} from "./config.js";
import { PORT } from "./config.js";

//app config
const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use('/compile', CompileRoute);
app.use('/problemList', ProblemListRoute);
app.use('/problem', ProblemRoute);
app.use('/submit', SubmitRoute);
app.use('/battleground', ContestRoute);
    

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB, running without database:', error.message);
    });

// Start server regardless of MongoDB connection
const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the process using that port or set a different PORT in backend/.env.`);
        process.exit(1);
    }
    console.error('Server error:', error);
    process.exit(1);
});