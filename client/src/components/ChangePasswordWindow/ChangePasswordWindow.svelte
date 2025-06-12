<script>
    import './ChangePasswordWindow.css';

    import { changePassword } from "../../util/userApi.js";
    import { showSuccess, showError, showWarning } from "../../util/toaster.js";

    export let open = false;
    export let onClose = () => {};

    let oldPassword = '';
    let newPassword = '';
    let confirmPassword = '';


    async function handleSubmit(event) {
        event.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            showWarning("Please fill in all fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            showWarning("New passwords do not match.");
            return;
        }
        
        const result = await changePassword(oldPassword, newPassword, confirmPassword);
        if (result.success) {
            showSuccess(result.message || "Password changed!");
            oldPassword = '';
            newPassword = '';
            confirmPassword = '';
            setTimeout(onClose, 1200);
        } else {
        showError(result.message || "Failed to change password.");
        }
    }
</script>

{#if open}
<div
    class="modal-backdrop"
    role="presentation"
    on:click={onClose}
    on:keydown={(event) => { if (event.key === 'Escape') onClose(); }}
>
    <div
        class="modal"
        role="dialog"
        aria-modal="true"
        tabindex="0"
        on:click|stopPropagation
        on:keydown={(event) => { if (event.key === 'Escape') onClose(); }}
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