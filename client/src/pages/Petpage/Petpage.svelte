<script>
    import '../page.css';
    import './Petpage.css';
    import { onMount, onDestroy } from 'svelte';
    import { session } from '../../stores/sessionStore';
    import { fetchPet } from '../../util/fetchPet';
    import { deletePet } from '../../util/deletePet';
    import { createPet } from '../../util/createPet';
    import { performPetAction } from '../../util/performPetAction';
    import { getPetAge } from '../../util/middleware/getPetAge';
    import { getPetImg } from '../../util/middleware/getPetImg';

    let pet = null;
    let ownerId = null;
    let petAge = null;
    let ageCounter;

    let petDead = false;
    let deadPetName;
    let deadPetId;

    session.subscribe((value) => {
        ownerId = value.userId;
    });

    async function loadPet(){
        const response = await fetchPet(ownerId);
        if (response.message === "Pet is dead!"){
            petDead = true;
            deadPetName = response.pet.name;
            deadPetId = response.pet._id;
            pet = null;
            return;
        } else if (response.pet){
            pet = response.pet;
            petDead = false;
            petAge = getPetAge(pet.createdAt, pet.lastUpdated);
        }
    }

    onMount(async () => {
       if (ownerId) {
            await loadPet();

            ageCounter = setInterval(() => {
                if (pet) {
                    petAge = getPetAge(pet.createdAt, new Date().toISOString());
                }
                // petAge = getPetAge(pet.createdAt, new Date().toISOString());
            }, 1000);
        } else {
            console.error("Owner ID is not available");
        }
    });
    onDestroy(() => {
        if (ageCounter) {
            clearInterval(ageCounter);
        }
    });

    async function handleAction(action) {
        try {
            const data = await performPetAction(pet._id, action);

            pet = { ...pet, ...data.pet };
            console.log(`Action ${action} performed successfully!`, data);
        } catch (err) {
            console.error(`Error performing action ${action}:`, err.message);
        }
    }
    async function handleDeadPet(){
        const name = prompt("Enter a name for your new pet:");
        if (!name) return;

        await deletePet(deadPetId);

        const data = await createPet(ownerId, name);

        await loadPet();
        petDead = false;
        if (pet) {
            petAge = getPetAge(pet.createdAt, pet.lastUpdated);
            pet = { ...pet, ...data.pet };
        }
    }
</script>
<div id='petpage' class="page">
    {#if petDead}
        <div id='pet-dead'>
            <h2>{deadPetName} is dead!</h2>
            <p>Would you like to create a new pet?</p>
            <button on:click={handleDeadPet}>Create New Pet</button>
        </div>
    {:else if pet && getPetAge}
    <div id='actions-container'>
        <button class='pet-action-btn' on:click={() => handleAction('feed')}>Feed</button>
        <button class='pet-action-btn' on:click={() => handleAction('pet')}>Pet</button>
        <button class='pet-action-btn' on:click={() => handleAction('play')}>Play</button>
        <button class='pet-action-btn' on:click={() => handleAction('heal')}>Heal</button>
        <button class='pet-action-btn' on:click={() => handleAction('rest')}>Rest</button>  
    </div>
    <div id='pet-container'>
        <div class="pet-details">

            <h2>{pet.name}</h2>
            <p><b>Lifespan:</b> {petAge?.days ?? 0} days, {petAge?.hours ?? 0} hours and {petAge?.minutes ?? 0} minutes</p>
            <div class="pet-image">
                <img src={getPetImg(pet.type)} alt={pet.name} />
            </div>
            <div id='stats'>

                <div class='stat'>
                    <span>Health:</span>
                    <progress max="100" value={pet.health}></progress>
                    <span class='stat-span'>{pet.health} / 100</span>
                </div>
                <div class='stat'>
                    <span>Happiness:</span>
                    <progress max="100" value={pet.happiness}></progress>
                    <span class='stat-span'>{pet.happiness} / 100</span>
                </div>
                <div class='stat'>
                    <span>Hunger:</span>
                    <progress max="100" value={pet.hunger}></progress>
                    <span class='stat-span'>{pet.hunger} / 100</span>
                </div>
                <div class='stat'>
                    <span>Energy:</span>
                    <progress max="100" value={pet.energy}></progress>
                    <span class='stat-span'>{pet.energy} / 100</span>
                </div>

            </div>
        </div>
    </div>
    {:else}
        <p>Loading pet details...</p>
    {/if}
</div>