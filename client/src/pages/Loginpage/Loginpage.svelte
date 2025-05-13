<script>
    import { login } from "../../util/auth.js";
    // import { showSuccess, showError } from "../../util/toaster.js";
    import '../page.css';

    let username = "";
    let password = "";

    const handleLogin = async () => {
      const result = await login(username, password);
    //   if (result.success) {
    //     showSuccess(result.message);
    //   } else {
    //     showError(result.message);
    //   }
    };
</script>

<div class='page'>
    <h1>Login</h1>
    
    <form on:submit|preventDefault={handleLogin}>
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
    <button type="submit">Login</button>
  </form>
</div>