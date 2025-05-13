<script>
    import '../page.css';
    import './Petpage.css';
    import { fetchPet } from '../../util/fetchPet';
    import { performPetAction } from '../../util/performPetAction';
    import { onMount } from 'svelte';
    import { session } from '../../stores/sessionStore';

    let pet = null;
    let ownerId = null;

    session.subscribe((value) => {
        ownerId = value.userId;
    });

    onMount(async () => {
       if (ownerId) {
            pet = await fetchPet(ownerId);
            console.log(pet);
        } else {
            console.error("Owner ID is not available");
        }
    });

    async function handleAction(action) {
        try {
            const data = await performPetAction(pet._id, action);
            pet = { ...pet, ...data.pet }; // Update the pet stats with the response
            console.log(`Action ${action} performed successfully!`, data);
        } catch (err) {
            console.error(`Error performing action ${action}:`, err.message);
        }
    }
</script>
<div id='petpage' class="page">
    {#if pet}
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
            <div class="pet-image">
                <img src='/kitkat.png' alt={pet.name} />
            </div>
            <div id='stats'>

                <div class='stat'>
                    <span>Health:</span>
                    <progress max="100" value={pet.health}></progress>
                </div>
                <div class='stat'>
                    <span>Happiness:</span>
                    <progress max="100" value={pet.happiness}></progress>
                </div>
                <div class='stat'>
                    <span>Hunger:</span>
                    <progress max="100" value={pet.hunger}></progress>
                </div>
                <div class='stat'>
                    <span>Energy:</span>
                    <progress max="100" value={pet.energy}></progress>
                    <span>{pet.energy} / 100</span>
                </div>

            </div>
        </div>
    </div>
    {:else}
        <p>Loading pet details...</p>
    {/if}
</div>