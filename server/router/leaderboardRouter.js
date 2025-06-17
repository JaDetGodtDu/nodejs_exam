import { Router } from "express";
import dbConnection from "../database/dbConnection.js";

const leaderboardRouter = Router();
const { users, pets } = dbConnection;

// leaderboardRouter.get("/", async (req, res) => {
//     const leaderboard = await users.aggregate([
//     { $unwind: "$pastPets" },
//     { $addFields: { petLifespan: { $subtract: ["$pastPets.diedAt", "$pastPets.createdAt"] } } },
//     { $sort: { petLifespan: -1 } },
//     { $limit: 10 },
//     { $project: { username: 1, "pastPets.name": 1, "pastPets.diedAt": 1, "pastPets.createdAt": 1, petLifespan: 1 } }
//     ]).toArray();

//     return res.status(200).json(leaderboard);
// });

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