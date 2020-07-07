// import modules
const mongoose = require('mongoose');
const dateFormat = require('dateformat');

/**
 * define article object attributes and values requirements
 * */
const articleObj = {
    title: {
        type: String,
        required: [true, 'title is required'],
        minlength: 4,
        maxlength: 120
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'author is required'],
    },
    publishedDate: {
        type: Date,
        deafult: Date.now(),
        // deafult: getLocalTime(),
        required: true,
    },
    coverImage: {
        type: String,
        default: null,
    },
    content: {
        type: String,
    },
}

// initialize the schema of Article
const articleSchema = new mongoose.Schema(articleObj);

// create a Article collection named userSchema
const Article = mongoose.model('Article', articleSchema);


// initialize the first article
let initialArticleObject = {
    title: 'Let go hiking',
    author: 'robertsunzhe',
    publishedDate: '1/2/2020',
    coverImage: 'hikingpic',
    content: "let's go don't say anything"
}

async function create_A_Article(initialArticleObject) {
    let createdArticle = null;
    User.create(initialUserObject).then((result) => {
        createdArticle = result;
        console.log(`article ${initialArticleObject.title} created success`);
    }).catch((err) => {
        console.log("article created failed");
    });
    return createdArticle;
}
// create_A_Article(initialArticleObject);


module.exports.Article = Article;
module.exports.create_A_Article = create_A_Article;


function getLocalTime(time) {
    let timeNow = new Date(time || Date.now());
    timeNow.setMinutes(timeNow.getMinutes() - timeNow.getTimezoneOffset());
    return timeNow.toISOString();
}