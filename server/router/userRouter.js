import {Router} from 'express';
import dbConnection from '../database/dbConnection.js';
import {ObjectId} from 'mongodb';
import {hashPassword, comparePassword} from '../util/hasher.js';
import { sendEmail } from '../util/emailer.js';

const userRouter = Router();
const { users, pets } = dbConnection;

// WILL MAYBE NEED THIS LATER, WE'LL SEE
// userRouter.get('/profile', async (req, res) => {
//     const userObjectId = new ObjectId(req.session.userId);
//     const user = await users.findOne({ _id: userObjectId});

//     if (!req.session.userId) {
//     return res.status(401).json({ message: 'No user logged in!' });
//     } else if (!user) {
//         return res.status(404).json({ message: 'User not found!' });
//     }

//     return res.status(200).json({
//         username: user.username,
//         email: user.email,
//         isAdmin: user.isAdmin,
//     });

// });
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
    const usersPet = await pets.findOne({ ownerId: userObjectId });

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