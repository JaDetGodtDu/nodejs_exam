export default function socketHandler(io) {
    const onlineUsers = new Map();

    io.on('connection', (socket) => {
        const { username, userId } = socket.handshake.query;
        if (username && userId) {
            console.log(`User connected: ${username} (ID: ${userId})`);
            // User starts connection = Add user to online users map
            onlineUsers.set(socket.id, { username, userId });
            io.emit('online-users', Array.from(onlineUsers.values()));
        }

        socket.on('chat-message', (msg) => {
            console.log(`Message from ${username}: ${msg}`);
            // Broadcast message to all connected users
            io.emit('chat-message', { from: username, msg });
        });

        socket.on('battle-request', (targetUserId) => {
            console.log(`Battle request from ${username} (ID: ${userId}) to user ID: ${targetUserId}`);
            // Find target user socket
            for (let [id, user] of onlineUsers.entries()) {
                if (user.userId === targetUserId) {
                    io.to(id).emit('battle-request', { from: username, fromUserId: userId });
                    break;
                }
            }
        });

        socket.on('battle-accept', (opponentUserId) => {
            console.log(`Battle accepted by ${username} (ID: ${userId}) for user ID: ${opponentUserId}`);
            // Notify users when accepted
            for (let [id, user] of onlineUsers.entries()) {
                if (user.userId === opponentUserId) {
                    io.to(id).emit('battle-start', { with: username, userId });
                    socket.emit('battle-start', { with: user.username, userId: user.userId });
                    break;
                }
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${username} (ID: ${userId})`);
            // Disconnect = Remove user from online users 
            onlineUsers.delete(socket.id);
            io.emit('online-users', Array.from(onlineUsers.values()));
        });
    })
}