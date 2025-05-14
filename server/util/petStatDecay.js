import dbConnection from "../database/dbConnection.js";
const { pets } = dbConnection;

export function petStatDecay() {
    setInterval(async() => {
        const petsArr = await pets.find({}).toArray();
        const currentTime = new Date();

        for (let pet of petsArr){
            const lastUpdated = new Date(pet.lastUpdated);
            const hoursPassed = Math.floor((currentTime - lastUpdated) / (1000 * 60 * 60));

            if (hoursPassed > 0) {
                let newHunger = Math.max(0, pet.hunger - (hoursPassed * 2));
                let newHappiness = Math.max(0, pet.happiness - (hoursPassed * 2));
                let newEnergy = Math.max(0, pet.energy - (hoursPassed * 2));

                let newHealth = pet.health;
                if (newHunger === 0) {
                    newHealth = Math.max(0, pet.health - (hoursPassed * 2));
                }

                await pets.updateOne(
                    { _id: pet._id },
                    {
                        $set: {
                            hunger: newHunger,
                            happiness: newHappiness,
                            energy: newEnergy,
                            health: newHealth,
                            lastUpdated: currentTime
                        }
                    }
                );
            }
        }

    }, 60 * 1000); // runs decay every minute, to check if an hour has passed

}