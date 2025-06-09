<script>
    import { onMount } from 'svelte';
    import { fetchPastPets } from '../../util/userApi.js';

    import { getPetAge } from '../../util/middleware/getPetAge.js';

    let pastPets = [];

    onMount(async () => {
        const result = await fetchPastPets();
        pastPets = result.pastPets || [];
    });

    function formatDate(date) {
        return new Date(date).toLocaleString();
    }
</script>

<h2>Your Pet Graveyard</h2>
{#if pastPets.length === 0}
    <p>No past pets yet!</p>
{:else}
    <ul>
        {#each pastPets as pet}
            <li>
                <strong>{pet.name}</strong><br>
                Lifespan: {getPetAge(pet.createdAt, pet.diedAt).days}d {getPetAge(pet.createdAt, pet.diedAt).hours}h {getPetAge(pet.createdAt, pet.diedAt).minutes}m<br>
            </li>
        {/each}
    </ul>
{/if}