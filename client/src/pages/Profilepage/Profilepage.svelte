<script>
    import '../page.css';
    import { navigate } from 'svelte-routing';
    import {session} from '../../stores/sessionStore';
    import { updateUser, deleteUser } from '../../util/userApi.js';
    import { showSuccess, showError, showWarning } from '../../util/toaster.js';

    import ChangePasswordWindow from '../../components/ChangePasswordWindow/ChangePasswordWindow.svelte';
    let showChangePasswordWindow = false;

    import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.svelte';
    let showConfirmDelete = false;

    let username;
    let email;

    session.subscribe(value => {
        username = value.username;
        email = value.email;
    })

    async function handleUpdate(){
        event.preventDefault();
        const result = await updateUser(username, email);
        if (result.success) {
            session.update(user => ({ ...user, username, email }));
            showSuccess(result.message || "Profile updated!");
        } else {
            showError(result.message || "Failed to update profile.");
        }
    }

    async function showDeleteModal() {
        showConfirmDelete = true;
    }

    async function handleDelete(){
        showConfirmDelete = false;
        const result = await deleteUser();
        if (result.success) {
            showSuccess(result.message || "Account deleted.");
            session.set({
            isLoggedIn: false,
            userId: null,
            isAdmin: false,
            username: null,
            email: null,
            });
            navigate('/');
        } else {
            showError(result.message || "Failed to delete account.");
        }
    }
    
    function cancelDelete() {
        showConfirmDelete = false;
    }
</script>

<div class='page'>
    <h1>Profilepage</h1>
    <div class='profile-container'>
        <p><b>Username:</b> {username}</p>
        <p><b>Email:</b> {email}</p>

    </div>

    <form on:submit|preventDefault={handleUpdate}>
        <h2>Update Profile</h2>
        <label>
            Username:
            <input type="text" bind:value={username} required />
        </label>
        <br />
        <label>
            Email:
            <input type="email" bind:value={email} required />
        </label>
        <br />
        <br />
        <button type="submit">Update Info</button>
        <br />
    </form>
    
    <button type="button" on:click={() => showChangePasswordWindow = true}>Change Password</button>
    <ChangePasswordWindow open={showChangePasswordWindow} onClose={() => showChangePasswordWindow = false} />

    <button type="button" style="color: red; margin-top: 2rem;" on:click={showDeleteModal}>
        Delete Account
    </button>
    <ConfirmModal 
        open={showConfirmDelete} 
        message="Are you sure you want to delete your account?" 
        onConfirm={handleDelete} 
        onCancel={cancelDelete}
    />
</div>