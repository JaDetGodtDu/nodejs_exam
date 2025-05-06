import {Router} from 'express';
import dbConnection from '../database/dbConnection.js';
import {hashPassword, comparePassword} from '../util/hasher.js';

const userRouter = Router();
const { users } = dbConnection;

userRouter.get('/signup', async (req, res) => {
    const {username, password, email} = req.body;
    const existingUser = await users.findOne({username});
    if (existingUser) {
        return res.status(400).json({message: 'Username taken!'});
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await users.insertOne({
        username,
        password: hashedPassword,
        email,
        isAdmin: false,
    });

    req.session.userId = newUser.insertedId;
    
    return res.status(201).json({message: 'User created successfully!'});

});

userRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await users.findOne({ username });

    if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials!' });
    }

    req.session.userId = user._id;
    return res.status(200).json({ message: 'Login successful!' });
});

userRouter.post('/logout', (req, res) => {
    req.session.destroy();
    return res.status(200).json({ message: 'Logged out successfully!' });
});

userRouter.get('/profile', (req, res) => {

});

userRouter.delete('/delete', (req, res) => {
    
});

export default userRouter;