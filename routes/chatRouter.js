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
    const { currentUser, reciver } = req.body;
    const users = new Array().push(currentUser, reciver);
    res.status(201).json({status: 'ok'});
});

module.exports = router;