<script>
    import './Navbar.css';
    import { Link } from "svelte-routing";
    import { onMount } from 'svelte';
    import { session } from '../../stores/sessionStore';
    import { logout } from '../../util/userApi.js';

    let isLoggedIn = false;
    let isAdmin = false;

    onMount(() =>{
        const unsubscribe = session.subscribe(value => {
            isLoggedIn = value.isLoggedIn;
            isAdmin = value.isAdmin;
        });

        return () => unsubscribe();
    })
</script>

<nav id="navbar">
    <Link to="/">
        <img src="/shiba.gif" alt="shiba">
    </Link>
    {#if isLoggedIn}
        <Link to="/petpage">Petpage</Link>  
        <Link to="/profilepage">Profile</Link>

        {#if isAdmin}
            <Link to="/adminpage">Admin</Link>
        {/if}
        <Link to="/battlepage">Battle</Link>
    <button on:click={logout}>Logout</button>
    {/if}
    {#if !isLoggedIn}     
        <Link to="/signup">Signup</Link>   
        <Link to="/login">Login</Link>
    {/if}
</nav>