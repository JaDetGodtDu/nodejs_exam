<script>
    import { onMount, onDestroy } from "svelte";
    import { connectSocket } from "../../stores/socketStore";

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
            onlineUsers = users.filter(user => user.userId !== userId);
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

    onDestroy(() => {
        if (socket) {
            socket.disconnect();
        }
    });

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
        battleRequests = battleRequests.filter(req => req.fromUserId !== fromUserId);
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
        {#each messages as message}
            <li><b>{message.from}:</b> {message.msg}</li>
        {/each}
    </ul>
    <input bind:value={message} on:keydown={(event) => event.key === "Enter" && sendMessage()} />
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