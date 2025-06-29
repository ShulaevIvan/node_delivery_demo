const mongoose = require('mongoose');
const userCollection = require('../database/models/User');

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

    async getAvalibleUsers() {
        try {
            return await userCollection.find({}, {             
                '__v': 0,
                '-email': 0,
                '-passwordHash': 0,
                '-name': 0,
                '-contactPhone': 0,
            })
            .then((data) => {
                return data;
            })
        }
        catch(err) {
            return [];
        }
       
    }
};

module.exports = new ChatModule();