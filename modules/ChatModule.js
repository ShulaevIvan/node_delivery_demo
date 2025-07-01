const mongoose = require('mongoose');
const userCollection = require('../database/models/User');
const chatCollection = require('../database/models/Chat')

class ChatModule {
    constructor() {

    }

    find(users) {

    }

    sendMessage() {

    }

    subscribe() {

    }

    getHistory() {

    }

    async createChat(users) {
        try {
            return new Promise((resolve, reject) => {
                chatCollection.find({users: users})
                .then((targetChat) => {
                    if (targetChat && targetChat.length > 0) {
                        resolve(targetChat[0]);
                    }
                    chatCollection.create({
                        users: users,
                        createdAt: new Date(),
                        messages: []
                    })
                    .then((createdChat) => {
                        resolve(createdChat);
                    })
                })
                .catch((err) => {
                    reject({err: err});
                })
            })
        }
        catch(err) {
            return [];
        }
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