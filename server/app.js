import express from 'express';
import cors from 'cors';
import sessionHandler from './util/sessionHandler.js';
import adminRouter from './router/adminRouter.js';
import userRouter from './router/userRouter.js';
import petRouter from './router/petRouter.js';
import sessionRouter from './router/sessionRouter.js';

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use(sessionHandler);
app.use('/admin', adminRouter)
app.use('/users', userRouter)
app.use('/pets', petRouter)
app.use( sessionRouter )

const PORT =  process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is runnong on http://localhost:${PORT}`);
});