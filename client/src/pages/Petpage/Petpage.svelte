<script>
    import '../page.css';
    import './Petpage.css';
    import { onMount, onDestroy } from 'svelte';
    import { session } from '../../stores/sessionStore';
    import { fetchPet, 
             deletePet, 
             createPet, 
             performPetAction, 
            } from '../../util/petApi.js';
    import { saveDeadPet } from '../../util/userApi';
    import { getPetAge } from '../../util/middleware/getPetAge';
    import { getPetImg } from '../../util/middleware/getPetImg';
    import { showSuccess, showError, showInfo, showWarning } from '../../util/toaster';

    let pet = null;
    let ownerId = null;
    let petAge = null;

    let ageCounter;

    let petDead = false;
    let deadPetName;
    let deadPetId;

    let lastPet = null;

    let newPetName;

    session.subscribe((value) => {
        ownerId = value.userId;
    });

    async function loadPet(){
        const response = await fetchPet(ownerId);
        if (response.message === "Pet is dead!"){
            petDead = true;
            deadPetName = response.pet.name;
            deadPetId = response.pet._id;
            lastPet = response.pet;
            pet = null;
            return;
        } else if (response.pet){
            pet = response.pet;
            lastPet = response.pet;
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
            const response = await performPetAction(pet._id, action);

            pet = { ...pet, ...response.pet };
            if(response.succes === false){
                showWarning(response.message);
            } else {
                showSuccess(`Action "${action}" performed!`);
            }
        } catch (err) {
            showError(`Error performing action: ${err.message}`);
        }
    }
    async function handleDeadPet(){
        if (!newPetName.trim()) {
            showWarning("Please enter a name for your new pet.");
            return;
        }
        await saveDeadPet({
        name: deadPetName,
        createdAt: lastPet?.createdAt || null,
        diedAt: new Date().toISOString()
        });

        const deleteResult = await deletePet(deadPetId);
        if (deleteResult.message !== "Pet deleted successfully!") {
            showError("Failed to delete dead pet.");
            return;
        }

        const createResult = await createPet(ownerId, newPetName);
        if (createResult.petId) {
            showSuccess("New pet created!");
            await loadPet();
            newPetName = "";
        } else {
            showError("Failed to create new pet.");
        }
    }
</script>
<div id='petpage' class="page">
    {#if petDead}
        <div id='pet-dead'>
            <h2>{deadPetName} is dead!</h2>
            <p>Would you like to create a new pet?</p>
            <input
            type="text"
            placeholder="Enter new pet name"
            bind:value={newPetName}
            on:keydown={(e) => e.key === 'Enter' && handleDeadPet()}
        />
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