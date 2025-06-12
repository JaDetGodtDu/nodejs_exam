export function battleSocket(socket, handlers) {
    socket.on("battle-request", handlers.onBattleRequest);
    socket.on("battle-accept", handlers.onBattleAccept);
    socket.on("battle-start", handlers.onBattleStart);
    socket.on("battle-end", handlers.onBattleEnd);

    return socket;
}