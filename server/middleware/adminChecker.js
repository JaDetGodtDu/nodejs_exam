import dbConnection from "../database/dbConnection.js";
import { ObjectId } from "mongodb";

const { users } = dbConnection;


export const isAdmin = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "No user logged in!" });
    }

    try {
        const user = await users.findOne({ _id: new ObjectId(req.session.userId) });
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only!" });
        }

        next(); 
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};