const dbConnection = require("../database/dbConnection.js");
const { db } = dbConnection;

export function petStatDecay() {
    setInterval(async() => {
        const pets = await db.collection("pets").find({}).toArray();
        const currentTime = new Date();

        for (let pet of pets){
            const lastUpdated = new Date(pet.lastUpdated);
            const minutesPassed = Math.floor((currentTime - lastUpdated) / (1000 * 60));

            if (minutesPassed > 0) {
                let newHunger = Math.max(0, pet.hunger - minutesPassed);
                let newHappiness = Math.max(0, pet.happiness - minutesPassed);
                let newEnergy = Math.max(0, pet.energy - minutesPassed);

                let newHealth = pet.health;
                if (newHunger === 0) {
                    newHealth = Math.max(0, pet.health - (minutesPassed * 2));
                }
            }
        }

    })

}