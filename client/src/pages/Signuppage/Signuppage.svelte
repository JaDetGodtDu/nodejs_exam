<script>
    import '../page.css';
    import signup from '../../util/signup';

    let username = '';
    let password = '';
    let email = '';

    const handleSignup = () => {
        signup(username, password, email)
        }
</script>

<div class='page'>
    
    <h1>Signup</h1>

    <form on:submit|preventDefault={handleSignup}>
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
  <button type="submit">Signup</button>
</form>

</div>