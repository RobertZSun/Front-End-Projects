const express = require('express');

const loginForPost = require('./admin/login_post').loginForPost;
const loginForGet = require('./admin/login_get').loginForGet;
const listUserForGet = require('./admin/listUser_get').listUserForGet;
const logoutForGet = require('./admin/logout_get').logoutForGet;
const addUserForGet = require('./admin/userEdit_get').addUserForGet;
const addUserForPost = require('./admin/userEdit_post').addUserForPost;
const modifyUserForPost = require('./admin/userModify_post').modifyUserForPost;
const removeUserForGet = require('./admin/userRemove_get').removeUserForGet;
const listArticlesForGet = require('./admin/listArticle_get').listArticlesForGet;
const editArticleForGet = require('./admin/editArticle_get').editArticleForGet;
const editArticleForPost = require('./admin/editArticle_post').editArticleForPost;
const addArticleForGet = require('./admin/addArticle_get').addArticleForGet;
const addArticleForPost = require('./admin/addArticle_post').addArticleForPost;
const removeArticleForGet = require('./admin/removeArticle_get').removeArticleForGet;

const admin = express.Router();

// render the login page
admin.get('/login', loginForGet);

// accomplish the login feature
admin.post('/login', loginForPost);

// list users feature
admin.get('/user', listUserForGet);

// log out feature
admin.get('/logout', logoutForGet);

// to go to a creating new user page
admin.get('/user-edit', addUserForGet);

// to actually create a new user
admin.post('/user-edit', addUserForPost);

// to modify an existed user
admin.post('/user-modify', modifyUserForPost);

// to remove an existed user
admin.get('/user-remove', removeUserForGet);

// articles list router
admin.get('/articles', listArticlesForGet);

// add article post request
admin.get('/add-article', addArticleForGet);

// add article post request
admin.post('/add-article', addArticleForPost);


// article edition router
admin.get('/article-edition', editArticleForGet);

// to actually edit a article
admin.post('/article-edition', editArticleForPost);



// remove article
admin.get('/remove-article', removeArticleForGet);






module.exports.admin = admin;