<script>
    import { changePassword } from "../../util/changePassword";

    export let open = false;
    export let onClose = () => {};

    let oldPassword = '';
    let newPassword = '';
    let confirmPassword = '';


    async function handleSubmit(event) {
            event.preventDefault();
            const result = await changePassword(oldPassword, newPassword, confirmPassword);

            if (result.success) {
                oldPassword = '';
                newPassword = '';
                confirmPassword = '';
                setTimeout(onClose, 1200);
            }
        }
</script>

{#if open}
<div
    class="modal-backdrop"
    role="presentation"
    on:click={onClose}
    on:keydown={(e) => { if (e.key === 'Escape') onClose(); }}
>
    <div
        class="modal"
        role="dialog"
        aria-modal="true"
        tabindex="0"
        on:click|stopPropagation
        on:keydown={(e) => { if (e.key === 'Escape') onClose(); }}
    >
        <h2>Change Password</h2>
        <form on:submit={handleSubmit}>
            <label>
                Old Password:
                <input type="password" bind:value={oldPassword} required />
            </label>
            <br />
            <label>
                New Password:
                <input type="password" bind:value={newPassword} required />
            </label>
            <br />
            <label>
                Confirm New Password:
                <input type="password" bind:value={confirmPassword} required />
            </label>
            <br />
            <button type="submit">Change Password</button>
            <button type="button" on:click={onClose}>Cancel</button>
        </form>
    </div>
</div>
{/if}

<style>
.modal-backdrop {
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100vw; 
    height: 100vh;
    background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
    z-index: 1000;
}
.modal {
    background: #242424;; padding: 2rem; border-radius: 8px; min-width: 300px;
}
</style>