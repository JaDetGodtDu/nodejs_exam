import { hashPassword } from "../util/hasher.js";
import dbConnection from "./dbConnection.js";

async function seedDB() {
    const { db } = dbConnection;

    const seededUsers = [{
        username: "admin",
        password: await hashPassword("adminpass"),
        email: "admin@example.com",
        isAdmin: true,
        pastPets: [],
    },
    {
        username: "user1",
        password: await hashPassword("user1pass"),
        email: "user1@example.com",
        isAdmin: false,
        pastPets: [],
    },
    {
        username: "user2",
        password: await hashPassword("user2pass"),
        email: "user2@example.com",
        isAdmin: false,
        pastPets: [{
            name:"Bombus",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
            diedAt: new Date(),
        }],
    },
    {
        username: "user3",
        password: await hashPassword("user3pass"),
        email: "user3@example.com",
        isAdmin: false,
        pastPets: [{
            name:"Wumbus",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
            diedAt: new Date(),
            },
            {
            name:"Chungus",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
            diedAt: new Date(),
            }],
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
    },
    {
        ownerId: seededUsersResult.insertedIds[2],
        name: "Fingus",
        type: 3,
        hunger: 0,
        happiness: 0,
        health: 0,
        energy: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), 
        lastUpdated: new Date(),
    },
    {
        ownerId: seededUsersResult.insertedIds[3],
        name: "Dingolion",
        type: 4,
        hunger: 25,
        happiness: 25,
        health: 75,
        energy: 25,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), 
        lastUpdated: new Date(),
    }]

    const clearPets = await db.collection("pets").deleteMany({});
    console.log(`Cleared pets collection!\n`, clearPets, `\nCleared ${clearPets.deletedCount} pets!`);
    const seededPetsResult = await db.collection("pets").insertMany(seededPets);
    console.log(`Inserted ${seededPetsResult.insertedCount} pets`);
}

seedDB()