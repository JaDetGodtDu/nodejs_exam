import { session } from "../stores/sessionStore";

let url = "http://localhost:8080/users";

export async function login(username, password) {
    const response = await fetch(`${url}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
    });

    if (response.ok) {
        const data = await response.json();
        session.set({
            isLoggedIn: true,
            userId: data.userId,
            isAdmin: data.isAdmin,
            username: data.username,
            email: data.email,
        });return {success: true, message: `Login successful! Welcome ${username}!` };
    } else {
        const data = await response.json();
        return {success: false, message: data.error || "Login failed!" };
    } 
}

export async function logout() {
    const response = await fetch(`${url}/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (response.ok) {
        session.set({
            isLoggedIn: false,
            userId: null,
            isAdmin: false,
            username: null,
            email: null,
        });
        return {success: true, message: "Logout successful!" };
    } else {
        const data = await response.json();
        return {success: false, message: data.error || "Logout failed!" };
    }
}