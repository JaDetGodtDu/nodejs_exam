export function chatSocket(socket, handlers) {
    socket.on("online-users", handlers.onOnlineUsers);
    socket.on("chat-message", handlers.onMessage);

    return socket;
}