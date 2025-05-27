import { hashPassword } from "../util/hasher.js";
import dbConnection from "./dbConnection.js";

async function seedDB() {
    const { db } = dbConnection;

    const seededUsers = [{
        username: "admin",
        password: await hashPassword("adminpass"),
        email: "admin@example.com",
        isAdmin: true,
    },
    {
        username: "user1",
        password: await hashPassword("user1pass"),
        email: "user1@example.com",
        isAdmin: false,
    }]

    const clearUsers = await db.collection("users").deleteMany({});
    console.log(`Cleared users collection!\n`, clearUsers, `\nCleared ${clearUsers.deletedCount} users!`);

    const seededUsersResult = await db.collection("users").insertMany(seededUsers);
    console.log(`Inserted ${seededUsersResult.insertedCount} users`);

    const seededPets = [{
        ownerId: seededUsersResult.insertedIds[0],
        name: "Bingus",
        type: 1,
        hunger: 100,
        happiness: 100,
        health: 100,
        energy: 100,
        createdAt: new Date(),
        lastUpdated: new Date(),
    },
    {
        ownerId: seededUsersResult.insertedIds[1],
        name: "Dingus",
        type: 2,
        hunger: 100,
        happiness: 100,
        health: 100,
        energy: 100,
        createdAt: new Date(),
        lastUpdated: new Date(),
    }]

    const clearPets = await db.collection("pets").deleteMany({});
    console.log(`Cleared pets collection!\n`, clearPets, `\nCleared ${clearPets.deletedCount} pets!`);
    const seededPetsResult = await db.collection("pets").insertMany(seededPets);
    console.log(`Inserted ${seededPetsResult.insertedCount} pets`);
}

seedDB()