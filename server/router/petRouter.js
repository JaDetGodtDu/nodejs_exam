import { Router } from "express";
import dbConnection from "../database/dbConnection.js";
import { ObjectId } from "mongodb";

const petRouter = Router();
const { pets, users } = dbConnection;

petRouter.get("/:id", (req, res) => {
    const { id } = req.params;
    const pet = pets.find(pet => pet.id === id);

    if (!pet) {
        return res.status(404).json({ message: "Pet not found!" });
    }

});

petRouter.post("/create", async (req, res) => {
    const { ownerId, name } = req.body;

    const ownerObjectId = new ObjectId(ownerId);
    const user = await users.findOne({ _id: ownerObjectId });
    
    const newPet = {
        ownerId: user._id,
        name,
        // random number between 1 and 10 for type - will determine the look of the pet
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

    const updatedPet = { ...pet};
    switch (action) {
        case "feed":
            updatedPet.hunger = Math.min(updatedPet.hunger + 10, 100);
            break;
        case "pet":
            updatedPet.happiness = Math.min(updatedPet.happiness + 5, 100);
            break;
        case "play":
            updatedPet.energy = Math.max(updatedPet.energy - 5, 0);
            updatedPet.happiness = Math.min(updatedPet.happiness + 10, 100);
            break;
        case "heal":
            updatedPet.health = Math.min(updatedPet.health + 10, 100);
            break;
        case "rest":
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

petRouter.delete("/delete", (req, res) => {

});

export default petRouter;