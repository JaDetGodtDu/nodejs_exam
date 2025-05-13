import { session } from '../stores/sessionStore';

const url = 'http://localhost:8080/users';

export async function logout() {
    const response = await fetch(`${url}/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    const data = await response.json();

    if(response.ok){
        session.set({
            isLoggedIn: false,
            userId: null,
            isAdmin: false,
        });
        return {success: true, message: data.message || "Logout successful!" };
    } else {
        return {success: false, message: data.error || "Logout failed!" };
    }
}