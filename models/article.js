const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    author: {
        type: String
    }
});

const article = new mongoose.model("Article", articleSchema);
module.exports = article;