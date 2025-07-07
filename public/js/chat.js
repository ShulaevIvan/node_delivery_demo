window.addEventListener('DOMContentLoaded', () => {


    const chatWrap = document.querySelector('.chat-wrap');
    const otherUsersWrap = chatWrap.querySelector('.other-users');
    const keyboard = chatWrap.querySelector('.chat-keyboard');
    const keyboardInput = keyboard.querySelector('.chat-input');
    const sendBtn = chatWrap.querySelector('.chat-send-btn');
    const findChatBtn = chatWrap.querySelector('.find-chat-find-btn');
    const createChatBtn = chatWrap.querySelector('.create-chat-btn');
    const createChatInput = chatWrap.querySelector('.create-chat-main-input');
    const findChatInput = chatWrap.querySelector('.find-chat-input');
    const chatWindow = chatWrap.querySelector('.chat-window-wrap');

    const currentUserData = {
        userId: chatWrap.querySelector('.current-user-id').textContent,
        email: chatWrap.querySelector('.current-user-email').textContent,
        contactPhone: chatWrap.querySelector('.current-user-phone').textContent,
        name: chatWrap.querySelector('.current-user-name').textContent,
        wsServer: chatWrap.querySelector('.ws-server-url').textContent
    };

    const server = `${currentUserData.wsServer}`;
    const socket = io().connect('/chat');
    
    

    const createChat = async () => {
        const reciverUserId = createChatInput.value;
        if (!currentUserData.userId || !reciverUserId) {
            createChatInput.value = '';
            return;
        }
        const chatData = {
            users: [currentUserData.userId, reciverUserId]
        };
        await fetch(`${server}/api/chat/create`, {
            method: 'POST',
            body: JSON.stringify(chatData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json());
    };

    const findChatHandler = async () => {
        const reciverUserId = findChatInput.value;
        const chatData = {
            users: [currentUserData.userId, reciverUserId],
        };
        await fetch(`${server}/api/chat/find`, {
            method: 'POST',
            body: JSON.stringify(chatData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json());
    };

    const createChatHandler = async () => {
        if (!currentUserData.userId) return;
        await createChat(currentUserData.userId);
    };

    const showHideChat = () => {
        if (chatWindow.classList.contains('chat-hidden')) {
            chatWindow.classList.remove('chat-hidden');
            return;
        }
        chatWindow.classList.add('chat-hidden');
    };

    const sendMessageHandler = async (e, reciveUser) => {
        console.log(keyboardInput.value)
        // const senderId = currentUserData.userId;
        // const reciverId = reciveUser;
        // const chatData = {
        //     sender: senderId,
        //     reciver: reciverId,
        //     message: '',
        // };
        // await fetch(`${server}/api/chat/send-message`, {
        //     method: 'POST',
        //     body: JSON.stringify(chatData),
        //     headers: {
        //         'Content-Type': 'application/json',
        //     }
        // })
        // .then((response) => response.json())
        // .then((data) => {
        //     console.log(data);
        // })
    };

    createChatBtn.addEventListener('click', createChatHandler);
    sendBtn.addEventListener('click', sendMessageHandler);
    findChatBtn.addEventListener('click', findChatHandler);
    getAvalibleUsers();


    async function getAvalibleUsers() {
        await fetch(`${server}/api/chat/get-avalible-users`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((usersData) => {
            const createOtherUser = (userId) => {
                const userLi = document.createElement('li');
                const openChatBtn = document.createElement('button');
                openChatBtn.textContent = 'open chat';
                openChatBtn.classList.add('send-msg-to-user-btn');
                userLi.textContent = `${userId} `;
                openChatBtn.addEventListener('click', showHideChat);
                userLi.appendChild(openChatBtn);
                otherUsersWrap.appendChild(userLi);
            };
            usersData.userList.filter((user) => user._id !== currentUserData.userId).forEach((item) => {
                createOtherUser(item._id);
            })
        });
    };
});