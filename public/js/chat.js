window.addEventListener('DOMContentLoaded', () => {


    const chatWrap = document.querySelector('.chat-wrap');
    const otherUsersWrap = chatWrap.querySelector('.other-users');
    const keyboard = chatWrap.querySelector('.chat-keyboard');
    const keyboardInput = keyboard.querySelector('.chat-input');
    const sendBtn = chatWrap.querySelector('.chat-send-btn');
    const chatWindow = chatWrap.querySelector('.chat-window-wrap');
    const chatMessagesWrap = chatWrap.querySelector('.chat-messages');
    const getHistoryBtn = chatWrap.querySelector('.get-history');

    const currentUserData = {
        userId: chatWrap.querySelector('.current-user-id').textContent,
        email: chatWrap.querySelector('.current-user-email').textContent,
        contactPhone: chatWrap.querySelector('.current-user-phone').textContent,
        name: chatWrap.querySelector('.current-user-name').textContent,
        wsServer: chatWrap.querySelector('.ws-server-url').textContent
    };

    const sendMessageState = {
        fromUser: '',
        toUser: '',
        message: '',
    };

    const server = `${currentUserData.wsServer}`;
    const socket = io().connect('/chat');

    const showHideChat = async (e) => {
        if (!chatWindow.classList.contains('chat-hidden')) {
            chatWindow.classList.add('chat-hidden');
            return;
        }
        clearChat();
        const reciverUserId = e.target.closest('li').querySelector('.chat-user-id').textContent;
        sendMessageState.fromUser = currentUserData.userId;
        sendMessageState.toUser = reciverUserId;
        chatWindow.classList.remove('chat-hidden');
        await findChatByUsers(currentUserData.userId, reciverUserId);
    };

    const sendMessageHandler = async () => {
        const chatData = {
            sender: sendMessageState.fromUser,
            reciver: sendMessageState.toUser,
            message: keyboardInput.value,
        };
        await fetch(`${server}/api/chat/send-message`, {
            method: 'POST',
            body: JSON.stringify(chatData),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then(() => {
            socket.emit('newMessage', keyboardInput.value);
        });
    };


    async function findChatByUsers(senderUserId, reciverUserId) {
        return await fetch(`${server}/api/chat/users-chat-messages`, {
            method: 'POST',
            body: JSON.stringify({users: [senderUserId, reciverUserId]}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((chatData) => {
            loadChatMessages(chatData.messages);
        });
    };

    function loadChatMessages(messagesArr) {
        if (!messagesArr || messagesArr.length < 1) return;

        messagesArr.forEach((messageObj) => {
            createMessageItem(messageObj);
        });
    };

    function createMessageItem(messageData) {
        const messageWrap = document.createElement('div');
        const messageRow = document.createElement('div');
        const messageDate = document.createElement('div');
        const messageFrom = document.createElement('div');
        const messageText = document.createElement('div');
        messageWrap.classList.add('chat-message-item');
        messageRow.classList.add('chat-message-user-info-row');
        messageDate.classList.add('chat-message-date');
        messageFrom.classList.add('chat-message-user-from');
        messageText.classList.add('chat-message-text');
        messageDate.textContent = messageData.sentAt;
        messageFrom.textContent = messageData.author;
        messageText.textContent = messageData.text;

        messageRow.appendChild(messageDate)
        messageRow.appendChild(messageFrom)
        messageWrap.appendChild(messageRow);
        messageWrap.appendChild(messageText);

        chatMessagesWrap.appendChild(messageWrap);
    };

    function clearChat() {
        const messages = chatMessagesWrap.querySelectorAll('.chat-message-item');
        keyboardInput.value = '';
        keyboardInput.placeholder = 'enter text';
        if (!messages || messages.length === 0) return;
        messages.forEach((item) => item.remove());
    }

    async function getAvalibleUsers() {
        await fetch(`${server}/api/chat/get-avalible-users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((usersData) => {
            const createOtherUser = (userId) => {
                const userLi = document.createElement('li');
                const userIdSpan = document.createElement('span');
                const openChatBtn = document.createElement('button');
                openChatBtn.textContent = 'open chat';
                openChatBtn.classList.add('send-msg-to-user-btn');
                userIdSpan.classList.add('chat-user-id');
                userIdSpan.textContent = `${userId}`;
                userLi.appendChild(userIdSpan);
                openChatBtn.addEventListener('click', showHideChat);
                userLi.appendChild(openChatBtn);
                otherUsersWrap.appendChild(userLi);
            };
            usersData.userList.filter((user) => user._id !== currentUserData.userId).forEach((item) => {
                createOtherUser(item._id);
            })
        });
    };

    sendBtn.addEventListener('click', sendMessageHandler);
    getAvalibleUsers();

    socket.on('getHistory', (messages) => {
        loadChatMessages(messages);
    })
});