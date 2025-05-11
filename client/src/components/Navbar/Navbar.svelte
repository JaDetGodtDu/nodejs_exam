<script>
    import './Navbar.css';
    import { Link } from "svelte-routing";
</script>

<nav id="navbar">
    <Link to="/">
        <img src="/shiba.gif" alt="shiba">
    </Link>
    <Link to="/petpage">Petpage</Link>
    <Link to="/profilepage">Profile</Link>
    <Link to="/login">Login</Link>
    <Link to="/signup">Signup</Link>
     
</nav>