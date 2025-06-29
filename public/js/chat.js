window.addEventListener('DOMContentLoaded', () => {


    const chatWrap = document.querySelector('.chat-wrap');
    const otherUsersWrap = chatWrap.querySelector('.other-users');
    const keyboard = chatWrap.querySelector('.chat-keyboard');
    const sendBtn = chatWrap.querySelector('.chat-send-btn');
    const findChatBtn = chatWrap.querySelector('.find-chat-find-btn');
    const currentUserData = {
        userId: chatWrap.querySelector('.current-user-id').textContent,
        email: chatWrap.querySelector('.current-user-email').textContent,
        contactPhone: chatWrap.querySelector('.current-user-phone').textContent,
        name: chatWrap.querySelector('.current-user-name').textContent,
        wsServer: chatWrap.querySelector('.ws-server-url').textContent
    };

    const server = `${currentUserData.wsServer}`;
    const socket = io().connect('/chat');

    const getAvalibleUsers = async () => {
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
                userLi.textContent = userId;
                otherUsersWrap.appendChild(userLi);
            };
            usersData.userList.filter((user) => user._id !== currentUserData.userId).forEach((item) => {
                createOtherUser(item._id);
            })
        });
    };


    const createChat = async (currentUser, reciver) => {
        if (!currentUser || !reciver) return;
        
        const chatData = {
            users: [].push(currentUser, reciver)
        };
        await fetch(`${server}/api/chat/create`, {
            method: 'POST',
            body: JSON.stringify(chatData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
    };

    const findChatHandler = async () => {
        if (!currentUserData.userId) return;
        await createChat(currentUserData.userId, 2);
        console.log('test312');
        console.log(currentUserData);
    };

    const sendMessageHandler = async () => {

    };

    findChatBtn.addEventListener('click', findChatHandler);
    sendBtn.addEventListener('click', sendMessageHandler);
    getAvalibleUsers();
});