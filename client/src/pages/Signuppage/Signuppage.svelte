<script>
    import '../page.css';
    import {signup} from '../../util/userApi.js';
    import { showSuccess, showError, showWarning } from '../../util/toaster.js';

    let username = '';
    let password = '';
    let email = '';
    let petname = '';

    const handleSignup = async () => {
        if (!username || !password || !email || !petname) {
            showWarning("Please fill in all fields.");
            return;
        }
        const result = await signup(username, password, email, petname);

        if (result.success) {
            showSuccess(result.message || "Signup successful!");
        } else {
            showError(result.message || "Signup failed.");
        }
    }
</script>

<div class='page'>   
    <h1>Signup</h1>

    <form on:submit|preventDefault={handleSignup}>
        <p>User info:</p>
        <label>
            Username:
            <input type="text" bind:value={username} required />
        </label>
        <br />
        <label>
            Password:
            <input type="password" bind:value={password} required />
        </label>
        <br />
        <label>
            Email:
            <input type="email" bind:value={email} required />
        </label>
        <br />
        <label>
            Pet name:
            <input type="text" bind:value={petname} required />
        </label>
        <br />
        <br />
        <button type="submit">Signup</button>
    </form>
</div>