<script>
    import './ChatWindow.css';
    import { afterUpdate } from 'svelte';

    export let messages = [];
    export let message = "";
    export let onMessageInput;
    export let onSend;

    let messagesContainer;

    afterUpdate(() => {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });
</script>

<div id="chat-window">
    <h3>Chat</h3>
    <div id="messages" bind:this={messagesContainer}>
        <ul>
            {#each messages as message}
            <li class="chat-message">
                <span class="username">{message.from}:</span>
                <span class="text">{message.msg}</span>
            </li> <br>
        {/each}
        </ul>
    </div>
    <div id="input">
        <input
            bind:value={message}
            on:input={onMessageInput}
            on:keydown={(event) => event.key === "Enter" && onSend()}
        />
        <button on:click={onSend}>Send</button>
    </div>
</div>