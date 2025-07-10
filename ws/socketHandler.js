const ChatModule = require('../modules/ChatModule');


const initSocket = (io) => {    
    io.on("connection", (socket) => {
        const currentUserId = socket.request.session.passport;
        socket.on('getHistory', async (chatId) => {
            const messages = await ChatModule.getHistory(chatId);
            socket.emit('getHistory', messages)
        });
        socket.on('newMessage', (message) => {
            console.log(message)
        });
        // console.log(socket.request.session.passport)
        io.on('disconnect', () => {
            console.log('test disconnect')
        })
    });
}

module.exports = initSocket;