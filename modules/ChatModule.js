const mongoose = require('mongoose');
const userCollection = require('../database/models/User');
const chatCollection = require('../database/models/Chat');
const messageCollection = require('../database/models/Message');

class ChatModule {
    constructor() {

    }

    async find(usersIdsArr) {
        try {
            if (!usersIdsArr && usersIdsArr.length < 2) return;
            let targetChat = await chatCollection.find({users: { $all: usersIdsArr }});
            if (targetChat && targetChat.length < 1) {
                targetChat = await this.createChat(usersIdsArr);
            }
            return targetChat;
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

    async createChat(users) {
        try {
            const createdChat = new chatCollection({
                users: [users[0], users[1]],
                createdAt: new Date(),
                messages: [],
            });
            return await createdChat.save();
        }
        catch(err) {
            return [];
        }
    }

    async saveMessageToChat(chat, senderId, messageText) {
        const newMessage = new messageCollection({
			author: senderId,
			sentAt: Date.now(),
			text: messageText,
			readAt: "",
		});
        await newMessage.save();
        if (chat) {
            await chatCollection.updateOne({_id: chat[0]._id}, {
                $push: {
                    messages: [newMessage]
                }
            });
            console.log('test');
            return newMessage;
        }
        await chatCollection.updateOne({_id: chat[0]._id}, {
            $set: {
                messages: [newMessage]
            }
        });
        return newMessage;
    };

    async sendMessage(data) {
        try {
            const senderUser = data.sender;
            const reciverUser = data.reciver;
            const messageText = data.message;
            if (!data.sender || !data.reciver) return;
            const users = await userCollection.find({'_id': {$in: [senderUser, reciverUser]}}).select('_id').exec();
            const chat = await this.find([users[0]._id, users[1]._id]);
            const message = await this.saveMessageToChat(chat, senderUser, messageText);
            return message;
        }
        catch(err) {

        }
    };

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