<script>
	import { onMount } from "svelte";
    import { getPetAge } from "../../util/middleware/getPetAge";

    import './Leaderboard.css';

    let leaderboard = [];

    onMount(async()=>{
        const response = await fetch("http://localhost:8080/leaderboard");
        leaderboard = await response.json();
    })
</script>
<div id="leaderboard">
    <h3>Leaderboard</h3>
    {#each leaderboard as entity, i}   
        <div class="leaderboard-entity">
            <span><strong>{i + 1}.</strong></span>
            <span class="username">{entity.username}</span><br>
            <span class="pet-name">{entity.petName}</span><br>
            {#await Promise.resolve(getPetAge(entity.createdAt, entity.diedAt)) then age}
                <span class="lifespan">{age.days}d {age.hours}h {age.minutes}m</span>
            {/await}
        </div>
    {/each}
</div>
