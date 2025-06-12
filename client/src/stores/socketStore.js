import { io } from "socket.io-client";
import { writable } from "svelte/store";

export const socketStore = writable(null);

export function connectSocket(username, userId){
    const socket = io("http://localhost:8080", {
        query: { username, userId },
        withCredentials: true,
    });

    socketStore.set(socket);

    return socket;
}