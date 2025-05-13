import { writable } from "svelte/store";

const sessionStore = JSON.parse(localStorage.getItem("session")) || {
    isLoggedIn: false,
    userId: null,
    isAdmin: false,
    username: null,
    email: null,
};

export const session = writable(sessionStore);

session.subscribe((value) => {
    localStorage.setItem("session", JSON.stringify(value));
})