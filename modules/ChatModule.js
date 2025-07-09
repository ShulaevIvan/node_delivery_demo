const mongoose = require('mongoose');
const EventEmitter = require('node:events');
const userCollection = require('../database/models/User');
const chatCollection = require('../database/models/Chat');
const messageCollection = require('../database/models/Message');


class ChatModule {
    constructor() {
        this.chatEmmiter = new EventEmitter();
    }

    async find(usersIdsArr) {
        try {
            if (!usersIdsArr && usersIdsArr.length < 2) return;
            let targetChat = await chatCollection.findOne({users: { $all: usersIdsArr }});
            if (!targetChat) {
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
            await createdChat.save();
            return createdChat;
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
        await chatCollection.updateOne({_id: chat._id}, {
            $push: {
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
            await this.getHistory(chat._id);
            this.chatEmmiter.emit('newMessage', { chat, message});
            
            return message;
        }
        catch(err) {
            console.log(err)
        }
    };

    subscribe(callback) {
        this.chatEmmiter.on('newMessage', ({ chat, message}) => {
            callback({ chatId: chat._id, message });
        });
    };

    async getHistory(chatId) {
        try {
            const messages = await chatCollection.findOne({'_id': chatId}).populate('messages');

            return messages;
        }
        catch(err) {

        }
    };

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