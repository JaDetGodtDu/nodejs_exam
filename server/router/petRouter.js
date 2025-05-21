import { Router } from "express";
import dbConnection from "../database/dbConnection.js";
import { ObjectId } from "mongodb";

const petRouter = Router();
const { pets, users } = dbConnection;

// petRouter.get("/:id", async (req, res) => {
//     const { id } = req.params;
//     const petObjectId = new ObjectId(id);
//     const pet = await pets.findOne({ _id: petObjectId });

//     if (!pet) {
//         return res.status(404).json({ message: "Pet not found!" });
//     }
//     return res.status(200).json({message: "Pet found!", pet });

// });
petRouter.get("/", async (req, res) => {
    const { ownerId } = req.query;
    
    const ownerObjectId = new ObjectId(ownerId);

    const pet = await pets.findOne({ ownerId: ownerObjectId });

    if (!pet) {
        return res.status(404).json({ message: "Pet not found!" });
    } else if (pet.health <= 0) {
        return res.status(200).json({ message: "Pet is dead!", pet: { name: pet.name, _id: pet._id } });
    }

    return res.status(200).json({ message: "Pet found!", pet });

});

petRouter.post("/create", async (req, res) => {
    const { ownerId, name } = req.body;

    const ownerObjectId = new ObjectId(ownerId);
    const user = await users.findOne({ _id: ownerObjectId });
    
    const newPet = {
        ownerId: user._id,
        name,
        type: Math.floor(Math.random() * 10) + 1,
        hunger: 100,
        happiness: 100,
        health: 100,
        energy: 100,
        createdAt: new Date(),
        lastUpdated: new Date(),
    };
    const result = await pets.insertOne(newPet);
    res.status(201).json({ message: "Pet created successfully!", petId: result.insertedId });
});

petRouter.post("/action", async (req, res) => {
    const { petId, action } = req.body;

    const petObjectId = new ObjectId(petId);
    const pet = await pets.findOne({ _id: petObjectId });

    if (!pet) {
        return res.status(404).json({ message: "Pet not found!" });
    } else if (pet.health <= 0) {
        return res.status(200).json({ message: "Pet is dead!" });
    }

    const updatedPet = { ...pet};
    switch (action) {
        case "feed":
            if (pet.hunger === 100) {
                return res.status(400).json({ message: "Pet is not hungry!" });
            }
            updatedPet.hunger = Math.min(updatedPet.hunger + 10, 100);
            break;
        case "pet":
            updatedPet.happiness = Math.min(updatedPet.happiness + 5, 100);
            break;
        case "play":
            if (pet.energy <= 5) {
                return res.status(200).json({ succes:false, message: "Not enough energy to play!" });
            }
            updatedPet.energy = Math.max(updatedPet.energy - 5, 0);
            updatedPet.happiness = Math.min(updatedPet.happiness + 10, 100);
            break;
        case "heal":
            if (pet.health === 100) {
                return res.status(200).json({ succes:false, message: "Pet is already healthy!" });
            }
            updatedPet.health = Math.min(updatedPet.health + 10, 100);
            break;
        case "rest":
            if (pet.energy === 100) {
                return res.status(200).json({ succes:false, message: "Pet is not tired!" });
            }
            if (pet.happiness === 0){
                return res.status(200).json({ succes:false, message: "Pet is too sad to rest!" });
            }
            updatedPet.energy = Math.min(updatedPet.energy + 10, 100);
            break;
        default:
            return res.status(400).json({ message: "Invalid action!" });
    }

    updatedPet.lastUpdated = new Date();

    const result = await pets.updateOne(
        { _id: petObjectId },
        { $set: updatedPet }
    );
    if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Failed to update pet", result });
    }
    const response = {
        name: updatedPet.name,
        type: updatedPet.type,
        hunger: updatedPet.hunger,
        happiness: updatedPet.happiness,
        health: updatedPet.health,
        energy: updatedPet.energy,
        lastUpdated: updatedPet.lastUpdated,
    };

    res.status(200).json({ message: "Action performed successfully!", pet: response });
});

petRouter.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    const petObjectId = new ObjectId(id);
    const pet = await pets.findOne({ _id: petObjectId });

    if (!pet) {
        return res.status(404).json({ message: "Pet not found!" });
    }

    const result = await pets.deleteOne({ _id: petObjectId });
    if (result.deletedCount === 0) {
        return res.status(500).json({ message: "Failed to delete pet!" });
    }
    return res.status(200).json({ message: "Pet deleted successfully!", pet });

});

export default petRouter;