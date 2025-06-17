<script>
    import { onMount } from 'svelte';
    import { fetchPastPets } from '../../util/userApi.js';

    import { getPetAge } from '../../util/middleware/getPetAge.js';

    let pastPets = [];

    onMount(async () => {
        const result = await fetchPastPets();
        pastPets = result.pastPets || [];
    });
</script>

<h2>Graveyard</h2>
{#if pastPets.length === 0}
    <p>No past pets yet!</p>
{:else}
    {#each pastPets as pet}
        {@const age = getPetAge(pet.createdAt, pet.diedAt)}
        <span>
            <strong>{pet.name}</strong><br>
            Lifespan: {age.days}d {age.hours}h {age.minutes}m<br>
        </span>
    {/each}

{/if}