<script>
    import { onMount } from "svelte";
    import { socketStore, connectSocket } from "../../stores/socketStore";

    let username = '';
    let userId = '';

    let onlineUsers = [];
    let messages = [];
    let message = '';
    let battleRequests = [];
    let activeBattle = false;
    let opponent = null;

    let socket;

    onMount(() => {
        username = localStorage.getItem('username') || '';
        userId = localStorage.getItem('userId') || '';
        
        socket = connectSocket(username, userId);

        socket.on("online-users", (users) => {
            onlineUsers = users.filter(u => u.userId !== userId);
        });

        socket.on("chat-message", (data) => {
            messages = [...messages, data];
        });

        socket.on("battle-request", (data) => {
            battleRequests = [...battleRequests, data];
        });

        socket.on("battle-start", (data) => {
            activeBattle = true;
            opponent = data.with;
        });
    })

    function sendMessage() {
        if (message.trim()) {
            socket.emit("chat-message", message);
            message = "";
        }
    }

    function requestBattle(targetUserId) {
        socket.emit("battle-request", targetUserId);
    }

    function acceptBattle(fromUserId) {
        socket.emit("battle-accept", fromUserId);
        battleRequests = battleRequests.filter(r => r.fromUserId !== fromUserId);
    }
</script>

<div class='page'>
    <h3>Online Users</h3>
    <ul>
        {#each onlineUsers as user}
            <li>
                {user.username}
                <button on:click={() => requestBattle(user.userId)}>Battle!</button>
            </li>
        {/each}
    </ul>

    <h3>Chat</h3>
    <ul>
        {#each messages as m}
            <li><b>{m.from}:</b> {m.msg}</li>
        {/each}
    </ul>
    <input bind:value={message} on:keydown={(e) => e.key === "Enter" && sendMessage()} />
    <button on:click={sendMessage}>Send</button>

    {#if battleRequests.length}
        <h3>Battle Requests</h3>
        <ul>
            {#each battleRequests as req}
                <li>
                    {req.from} wants to battle!
                    <button on:click={() => acceptBattle(req.fromUserId)}>Accept</button>
                </li>
            {/each}
        </ul>
    {/if}

    {#if activeBattle}
        <h2>Battle started with {opponent}!</h2>
        <!-- TODO: Make battle ui -->
    {/if}
</div>