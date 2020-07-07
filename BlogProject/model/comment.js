// import modules
const mongoose = require('mongoose');

/**
 * define comment object attributes and values requirements
 * */
const commentObj = {
    articleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: [true, 'article id is required'],
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user id is required'],
    },
    time: {
        type: Date,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
}

// initialize the schema of comment
const commentSchema = new mongoose.Schema(commentObj);

// create a comment collection named commentSchema
const Comment = mongoose.model('Comment', commentSchema);

module.exports.Comment = Comment;