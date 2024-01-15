const mongoose = require('mongoose');
const User = require('./userModel');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,"Please give a title"],
    },
    description: {
        type: String,
        required: [true,"Please give a description"],
    },
    // user:{
    //     type:mongoose.Schema.ObjectId,
    //     ref:User,
    //     required: [true,"Note must be made by someone"]
    // },
    createdAt: {
        type:Date,
        default:Date.now(),
    }
});

const Note = mongoose.model('Note',noteSchema);

module.exports = Note;