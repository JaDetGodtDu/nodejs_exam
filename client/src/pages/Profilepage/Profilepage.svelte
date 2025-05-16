<script>
    import '../page.css';
    import {onMount} from 'svelte';
    import {session} from '../../stores/sessionStore';
    import { updateUser } from '../../util/updateUser';

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
        <button type="button" on:click={() => showChangePasswordWindow = true}>Change Password</button>
        <ChangePasswordWindow open={showChangePasswordWindow} onClose={() => showChangePasswordWindow = false} />
</form>

</div>