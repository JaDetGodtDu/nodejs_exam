import {Router} from 'express';
import dbConnection from '../database/dbConnection.js';
import {ObjectId} from 'mongodb';
import {hashPassword, comparePassword} from '../util/hasher.js';

const userRouter = Router();
const { users } = dbConnection;

userRouter.post('/signup', async (req, res) => {
    const {username, password, email} = req.body;
    const existingUser = await users.findOne({username});
    if (existingUser) {
        return res.status(400).json({message: 'Username taken!'});
    } else if (req.session.userId) {
        return res.status(400).json({ message: 'User already logged in!' });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await users.insertOne({
        username,
        password: hashedPassword,
        email,
        isAdmin: false,
    });

    if (!newUser) {
        return res.status(500).json({ message: 'Error creating user!' });
    }

    return res.status(201).json({ message: 'User created successfully!' });

});

userRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await users.findOne({ username });

    if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials!' });
    }
    if (req.session.userId) {
        return res.status(400).json({ message: 'User already logged in!' });
    }
    req.session.userId = user._id;
    return res.status(200).json({ message: 'Login successful!' });
});

userRouter.post('/logout', (req, res) => {
    if (!req.session.userId) {
        return res.status(400).json({ message: 'No user logged in!' });
    }
    req.session.destroy();
    return res.status(200).json({ message: 'Logged out successfully!' });
});

userRouter.get('/profile', async (req, res) => {
    const userObjectId = new ObjectId(req.session.userId);
    const user = await users.findOne({ _id: userObjectId});

    if (!req.session.userId) {
    return res.status(401).json({ message: 'No user logged in!' });
    } else if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }

    return res.status(200).json({
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
    });

});

userRouter.delete('/delete', async (req, res) => {
    const userObjectId = new ObjectId(req.session.userId);
    const user = await users.findOne({ _id: userObjectId});

    if (!req.session.userId) {
        return res.status(401).json({ message: 'No user logged in!' });
    } else if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }

    await users.deleteOne({ _id: userObjectId });
    req.session.destroy();
    return res.status(200).json({ message: 'You deleted your user succesfully!', username: user.username });
    
});

export default userRouter;