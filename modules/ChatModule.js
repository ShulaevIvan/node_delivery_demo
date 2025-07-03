const mongoose = require('mongoose');
const userCollection = require('../database/models/User');
const chatCollection = require('../database/models/Chat')

class ChatModule {
    constructor() {

    }

    async find(usersIdsArr) {
        try {
            if (!usersIdsArr && usersIdsArr.length < 2) return;
            const sendUserId = usersIdsArr[0];
            const reciveUserId = usersIdsArr[1];
            
           return await chatCollection.find().populate('users', sendUserId).populate('users', reciveUserId)
           .then((targetChat) => {
                if (!targetChat && targetChat.length < 1) return null
                return targetChat;
            });
        }
        catch(err) {

        }
    }

    async findChatByUserId(userId) {
        return await chatCollection.find().populate('users', userId)
        .then((targetChat) => {
            return targetChat;
        })
    }

    async sendMessage(author, reciver, message) {
        try {

        }
        catch(err) {

        }
    };

    async createChat(users) {
        try {
            await this.find(users)
            .then((existingChat) => {
                if (existingChat && existingChat.length > 0) {
                    console.log('test222')
                    return existingChat;
                }
                chatCollection.create({
                    users: users,
                    createdAt: new Date(),
                    messages: [],
                })
                .then((createdChat) => {
                    console.log(createdChat)
                    return createdChat;
                });
            });
            
        }
        catch(err) {
            return [];
        }
    }

    subscribe() {

    }

    getHistory() {

    }

    async getAvalibleUsers() {
        try {
            return await userCollection.find({}, {             
                '__v': 0,
                '-email': 0,
                '-passwordHash': 0,
                '-name': 0,
                '-contactPhone': 0,
            })
            .then((avalibleChatUsers) => {
                return avalibleChatUsers;
            })
        }
        catch(err) {
            return [];
        }
    }
};

module.exports = new ChatModule();