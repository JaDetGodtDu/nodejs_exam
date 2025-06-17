import { Router } from "express";
import dbConnection from "../database/dbConnection.js";

const leaderboardRouter = Router();
const { users } = dbConnection;

leaderboardRouter.get("/", async (req, res) => {
    const leaderboard = await users.aggregate([
    { $unwind: "$pastPets" },
    { $addFields: { petLifespan: { $subtract: ["$pastPets.diedAt", "$pastPets.createdAt"] } } },
    { $sort: { petLifespan: -1 } },
    { $limit: 10 },
    { $project: { username: 1, "pastPets.name": 1, "pastPets.diedAt": 1, "pastPets.createdAt": 1, petLifespan: 1 } }
    ]).toArray();

    return res.status(200).json(leaderboard);
});

export default leaderboardRouter;