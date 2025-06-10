import { session } from "../stores/sessionStore";

export default async function fetchSession() {
    const response = await fetch("http://localhost:8080/session", {
        method: "GET",
        credentials: "include",
    });
    if (response.ok) {
        const data = await response.json();
        session.set({
            isLoggedIn: data.isLoggedIn,
            userId: data.userId,
            isAdmin: data.isAdmin,
            username: data.username,
            email: data.email,
        });
    } else {
        session.set({
            isLoggedIn: false,
            userId: null,
            isAdmin: false,
            username: null,
            email: null,
        });
    }

}