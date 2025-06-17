import { Router } from "express";
import dbConnection from "../database/dbConnection.js";

const leaderboardRouter = Router();
const { users, pets } = dbConnection;

leaderboardRouter.get("/", async (req, res) => {
    const pastPets = await users.aggregate([
        { $unwind: "$pastPets" },
        { $project: {
            username: 1,
            petName: "$pastPets.name",
            createdAt: "$pastPets.createdAt",
            diedAt: "$pastPets.diedAt"
        }}
    ]).toArray();

    const alivePets = await pets.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "ownerId",
                foreignField: "_id",
                as: "owner"
            }
        },
        { $unwind: "$owner" },
        { $project: {
            username: "$owner.username",
            petName: "$name",
            createdAt: 1,
            diedAt: { $literal: new Date() }
        }}
    ]).toArray();

    const allPets = [...pastPets, ...alivePets].map(pet => ({
        username: pet.username,
        petName: pet.petName,
        createdAt: pet.createdAt,
        diedAt: pet.diedAt,
        lifespan: new Date(pet.diedAt).getTime() - new Date(pet.createdAt).getTime()
    }));

    allPets.sort((a, b) => b.lifespan - a.lifespan);
    const leaderboard = allPets.slice(0, 6);

    return res.status(200).json(leaderboard);
});

export default leaderboardRouter;