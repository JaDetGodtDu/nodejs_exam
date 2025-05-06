import express from 'express';
import sessionHandler from './util/sessionHandler.js';
import adminRouter from './router/adminRouter.js';
import userRouter from './router/userRouter.js';
import petRouter from './router/petRouter.js';

const app = express();

app.use(express.json());
app.use(sessionHandler);
app.use('/admin', adminRouter)
app.use('/users', userRouter)
app.use('/pets', petRouter)

const PORT =  process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is runnong on http://localhost:${PORT}`);
});