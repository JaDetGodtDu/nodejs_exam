<script>
    import ChatWindow from "../../components/ChatWindow/ChatWindow.svelte";

    import { onMount, onDestroy } from "svelte";
    import { connectSocket } from "../../stores/socketStore";
    import { chatSocket } from "../../util/chatSocket";
    import { battleSocket } from "../../util/battleSocket";

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

        chatSocket(socket, {
            onMessage: (message) => {
                messages = [...messages, message];
            },
            onOnlineUsers: (users) => {
                onlineUsers = users.filter(user => user.userId !== userId);
            },
        })

        battleSocket(socket, {
            onBattleRequest: (battleRequest) => {
                battleRequests = [...battleRequests, battleRequest];
            },
            onBattleAccept: (battle) => {
                activeBattle = true;
                opponent = battle.opponent;
                battleRequests = battleRequests.filter(req => req.fromUserId !== battle.fromUserId);
            },
            onBattleStart: (battle) => {
                activeBattle = true;
                opponent = battle.opponent;
            },
            onBattleEnd: () => {
                activeBattle = false;
                opponent = null;
            }
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
            {user.username}
            <button on:click={() => requestBattle(user.userId)}>Battle!</button>
        {/each}
    </ul>

    <ChatWindow
        {messages}
        bind:message
        onMessageInput={(event) => message = event.target.value}
        onSend={sendMessage}
    />

    {#if battleRequests.length}
        <h3>Battle Requests</h3>
        <ul>
            {#each battleRequests as req}
                {req.from} wants to battle!
                <button on:click={() => acceptBattle(req.fromUserId)}>Accept</button>
            {/each}
        </ul>
    {/if}

    {#if activeBattle}
        <h2>Battle started with {opponent}!</h2>
        <!-- TODO: Make battle ui -->
    {/if}
</div>