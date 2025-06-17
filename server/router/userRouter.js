import {Router} from 'express';
import dbConnection from '../database/dbConnection.js';
import {ObjectId} from 'mongodb';
import {hashPassword, comparePassword} from '../util/hasher.js';
import { sendEmail } from '../util/emailer.js';
import { authLimiter } from '../middleware/rateLimiter.js'; // <-- Add this import

const userRouter = Router();
const { users, pets } = dbConnection;

userRouter.post('/signup', authLimiter, async (req, res) => {
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

    const welcomeEmail = await sendEmail(
        email, 
        `Welcome to Bingoloids!`, 
        `Hello ${username}.\n
        Welcome to Bingoloids - your pet life simulator!`
    );

    if (!newUser) {
        return res.status(500).json({ message: 'Error creating user!' });
    } else if (!welcomeEmail.success) {
        return res.status(500).json({ message: 'Error sending welcome email!' });
    }

    return res.status(201).json({ message: 'User created successfully!', userId: newUser.insertedId, previewUrl: welcomeEmail.previewUrl });

});

userRouter.post('/login', authLimiter, async (req, res) => {
    const { username, password } = req.body;
    const user = await users.findOne({ username });

    if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials!' });
    }
    if (req.session.userId) {
        return res.status(400).json({ message: 'User already logged in!' });
    }

    req.session.userId = user._id;
    req.session.isAdmin = user.isAdmin;
    req.session.username = user.username;
    req.session.email = user.email;

    return res.status(200).json({ 
        message: 'Login successful!', 
        userId: user._id, 
        isAdmin: user.isAdmin, 
        username: user.username, 
        email: user.email });
});

userRouter.post('/logout', (req, res) => {
    if (!req.session.userId) {
        return res.status(400).json({ message: 'No user logged in!' });
    }
    req.session.destroy(()=>{
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out successfully!' });
    });
});

userRouter.post('/pastPets', async (req, res) => {
    const userObjectId = new ObjectId(req.session.userId);
    const user = await users.findOne({ _id: userObjectId });

    let {name, createdAt, diedAt} = req.body;

    createdAt = createdAt ? new Date(createdAt) : null;
    diedAt = diedAt ? new Date(diedAt) : null;

    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }

    await users.updateOne(
        { _id: userObjectId },
        { $push: { pastPets: { name, createdAt, diedAt } } }
    );
    return res.status(200).json({ message: 'Pet added to past pets successfully!', name, createdAt, diedAt });
})

userRouter.get('/pastPets', async (req, res) => {
    const userObjectId = new ObjectId(req.session.userId);
    const user = await users.findOne({ _id: userObjectId }, { projection: { pastPets: 1 } });

    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }
    
    res.json({ pastPets: user.pastPets || [] });
});

userRouter.put('/update', async (req, res) => {
    const { username, email} = req.body;
    const userObjectId = new ObjectId(req.session.userId);
    const user = await users.findOne({ _id: userObjectId});

    if (!user){
        return res.status(404).json({ message: 'User not found!' });
    }

    const updatedUser = await users.updateOne(
        { _id: userObjectId },
        { $set: { username, email } }
    );

    if (!updatedUser) {
        return res.status(500).json({ message: 'Error updating user!' });
    }

    return res.status(200).json({ message: 'User updated successfully!', username, email });
})
userRouter.put('/updatePassword', async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userObjectId = new ObjectId(req.session.userId);
    const user = await users.findOne({ _id: userObjectId });

    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    } else if (!(await comparePassword(oldPassword, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials!' });
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await users.updateOne(
        { _id: userObjectId },
        { $set: { password: hashedPassword } }
    );

    if (!updatedUser) {
        return res.status(500).json({ message: 'Error updating password!' });
    }

    return res.status(200).json({ message: 'Password updated successfully!' });
})
userRouter.delete('/delete', async (req, res) => {
    const userObjectId = new ObjectId(req.session.userId);
    const user = await users.findOne({ _id: userObjectId});

    if (!req.session.userId) {
        return res.status(401).json({ message: 'No user logged in!' });
    } else if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }
 
    await users.deleteOne({ _id: userObjectId });
    await pets.deleteOne({ ownerId: userObjectId });
    
    req.session.destroy();

    return res.status(200).json({ message: 'You deleted your user succesfully!', username: user.username });  
});

export default userRouter;