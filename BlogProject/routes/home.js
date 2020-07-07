const express = require('express');
const homepageForGet = require('./home/mainpage_get').homepageForGet;
const readOneArticleForGet = require('./home/articlePage_get').readOneArticleForGet;
const storeCommentForPost = require('./home/comment_post').storeCommentForPost;


const home = express.Router();

home.get('/', homepageForGet);

home.get('/article', readOneArticleForGet);

home.post('/comment', storeCommentForPost);

module.exports.home = home;