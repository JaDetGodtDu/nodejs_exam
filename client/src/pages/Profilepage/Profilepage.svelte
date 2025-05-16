<script>
    import '../page.css';
    import { navigate } from 'svelte-routing';
    import {session} from '../../stores/sessionStore';
    import { updateUser } from '../../util/updateUser';
    import { deleteUser } from '../../util/deleteUser';

    import ChangePasswordWindow from '../../components/ChangePasswordWindow/ChangePasswordWindow.svelte';
    let showChangePasswordWindow = false;

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
        }
    }
    async function handleDelete(){
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }
        const result = await deleteUser();
        alert(result.message);
        if (result.success) {
            session.set({
                isLoggedIn: false,
                userId: null,
                isAdmin: false,
                username: null,
                email: null,
            });
            navigate('/');
        }
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
    <button type="button" style="color: red; margin-top: 2rem;" on:click={handleDelete}>
        Delete Account
    </button>
</div>