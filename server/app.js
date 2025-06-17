import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// SOCKET
import http from 'http';
import { Server } from 'socket.io';

// SESSION
import sessionHandler from './util/sessionHandler.js';

// UTILS
import { petStatDecay } from './util/petStatDecay.js';
import { rateLimiter, adminLimiter }from './middleware/rateLimiter.js';


// ROUTING
import adminRouter from './router/adminRouter.js';
import userRouter from './router/userRouter.js';
import petRouter from './router/petRouter.js';
import sessionRouter from './router/sessionRouter.js'
import leaderboardRouter from './router/leaderboardRouter.js';

const app = express();

app.use(helmet()); 

app.use(express.json());

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use(sessionHandler);
// app.use(rateLimiter);
app.use('/admin', adminLimiter, adminRouter)
app.use('/users', rateLimiter, userRouter)
app.use('/pets', rateLimiter, petRouter)
app.use('/leaderboard', rateLimiter, leaderboardRouter);
app.use(sessionRouter)

import socketHandler from './util/socketHandler.js';
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});
socketHandler(io);

petStatDecay();

const PORT =  process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is runnong on http://localhost:${PORT}`);
});