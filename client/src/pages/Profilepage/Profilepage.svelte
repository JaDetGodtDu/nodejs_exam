<script>
    import '../page.css';
    import {onMount} from 'svelte';
    import {session} from '../../stores/sessionStore';

    let username;
    let email;

    session.subscribe(value => {
        username = value.username;
        email = value.email;
    })
</script>

<div class='page'>
    <h1>Profilepage</h1>
    <div class='profile-container'>
        <p><b>Username:</b> {username}</p>
        <p><b>Email:</b> {email}</p>

    </div>
</div>