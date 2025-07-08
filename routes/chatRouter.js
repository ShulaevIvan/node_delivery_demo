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
        res.status(200).json({status: 'ok'});
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

module.exports = router;