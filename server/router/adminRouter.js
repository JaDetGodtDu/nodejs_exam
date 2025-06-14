import { Router } from "express";
import dbConnection from "../database/dbConnection.js";
import { ObjectId } from "mongodb";
import { isAdmin } from "../middleware/adminChecker.js";

const adminRouter = Router();
const { users, pets } = dbConnection;

adminRouter.use(isAdmin);

// USERS - READ ------------------------------------------------------------------
adminRouter.get("/users", isAdmin, async (req, res) => {
    const allUsers = await users.find({}).toArray();
    
    res.status(200).json(allUsers);
});
adminRouter.get("/users/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    const user = await users.findOne({ _id: new ObjectId(id) });

    if (!user) {
        return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(user);
});
// USERS - UPDATE ------------------------------------------------------------------
adminRouter.put("/users/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    const {username, email} = req.body;

    const result = await users.updateOne(
        { _id: new ObjectId(id) },
        { $set: { username, email } }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "Admin updated user successfully!" });
});
// USERS - DELETE ------------------------------------------------------------------
adminRouter.delete("/users/:id", isAdmin, async (req, res) => {
    const { id } = req.params;

    const result = await users.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "Admin deleted user successfully!" });
});

// PETS - READ ------------------------------------------------------------------
adminRouter.get("/pets", isAdmin, async (req, res) => {
    const allPets = await pets.find({}).toArray();

    res.status(200).json(allPets);
});
adminRouter.get("/pets/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    const pet = await pets.findOne({ ownerId: new ObjectId(id) });

    if (!pet) {
        return res.status(404).json({ message: "Pet not found!" });
    }

    res.status(200).json({pet});
})
// PETS - UPDATE ------------------------------------------------------------------
adminRouter.put("/pets/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    const update = req.body;
    const result = await pets.updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
    );
    if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Pet not found!" });
    }
    res.status(200).json({ message: "Admin updated pet successfully!" });
});
// PETS - DELETE ------------------------------------------------------------------
adminRouter.delete("/pets/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    const result = await pets.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Pet not found!" });
    }

    res.status(200).json({ message: "Admin deleted pet successfully!" });
});

export default adminRouter;