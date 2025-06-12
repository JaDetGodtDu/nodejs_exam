import { Router } from "express";
import dbConnection from "../database/dbConnection.js";
import { ObjectId } from "mongodb";
import { isAdmin } from "../middleware/adminChecker.js";

const adminRouter = Router();
const { users, pets } = dbConnection;

adminRouter.use(isAdmin);

adminRouter.get("/users", isAdmin, async (req, res) => {
    const allUsers = await users.find({}).toArray();
    
    res.status(200).json(allUsers);
});

adminRouter.delete("/users/:id", isAdmin, async (req, res) => {
    const { id } = req.params;

    const result = await users.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "Admin deleted user successfully!" });
});

adminRouter.get("/pets", isAdmin, async (req, res) => {
    const allPets = await pets.find({}).toArray();

    res.status(200).json(allPets);
});

adminRouter.delete("/pets/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    const result = await pets.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Pet not found!" });
    }

    res.status(200).json({ message: "Admin deleted pet successfully!" });
});

export default adminRouter;