const router = require('express').Router();
const isAuthenticated = require('../utils/isAuthenticated');
const ChatModule = require('../modules/ChatModule');

router.get('/', async (req, res) => {
    res.status(200).json({status: 'ok'});
});

router.get('/get-avalible-users', isAuthenticated, async (req, res) => {
    await ChatModule.getAvalibleUsers()
    .then((data) => {
        res.status(200).json({status: 'ok', userList: data});
    });
});

router.post('/create', async (req, res) => {
    const { users } = req.body;
    if (!users || users.length < 2) {
        return req.status(200).json({status: 'err'});
    }
    await ChatModule.createChat(users)
    .then((data) => {
        res.status(201).json({status: 'ok', chat: data});
    });
});

router.post('/find', async (req, res) => {
    const { users } = req.body;
    await ChatModule.find(users)
    .then((data) => {
        res.status(200).json({status: 'ok', chat: data});
    });
});

router.post('/send-message', async (req, res) => {
    const { sender, reciver, message } = req.body;
    const data = {
        sender: sender,
        reciver: reciver,
        message: message
    };
    await ChatModule.sendMessage(data);
});

router.get('/get-history', async (req, res) => {
    const chatId = req.query.id;
    if (!chatId) return res.status(200).json({status: 'ok', data: []});
    const messages = await ChatModule.getHistory(chatId);

    res.status(200).json({status: 'ok', data: messages});
});

router.post('/find-chat', async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(201).json({status: 'ok', chatId: ''});
    const chatId = await ChatModule.findChatByUserId(userId);
    res.status(201).json({status: 'ok', chatId: chatId});
});

router.post('/users-chat-messages', async (req, res) => {
    const { users } = req.body;
    const messages = await ChatModule.findMessagesByUsers(users);

    res.status(201).json({status: 'ok', messages: messages});
});

module.exports = router;