const express = require('express');
const expressSession = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dateFormat = require('dateformat');
const artTemplate = require('art-template');
const expressArtTemplate = require('express-art-template');

artTemplate.defaults.imports.dateFormat = dateFormat;


const login_guard = require('./middleware/loginGuard').login_guard;
const home = require('./routes/home').home;
const admin = require('./routes/admin').admin;

const staticResourcePath = path.join(__dirname, "public");
const templateFilePath = path.join(__dirname, "views");

// connect the database
require('./model/connector.js');

// initialize the first user
// const User = require('./model/user.js').User;

const app = express();

// determine the environment
let env = process.env.NODE_ENV
    // development environment
if (env == 'development') {
    console.log('development environment');
    app.use(morgan('dev'));
} else {
    // production environment
    console.log('production environment');
}
app.use(express.static(staticResourcePath));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressSession({
    secret: 'myBlog',
    name: 'mysid',
    resave: true,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        // expires=new Date().toGMTString(),
        maxAge: 24*60*60*1000,
    }
}));

// initialize the art template engine
app.engine('art', expressArtTemplate);
app.set('views', templateFilePath);
app.set('view engine', 'art');


// assign the router
app.use('/admin', login_guard);
app.use('/home', home);
// to check the user status right now whether logged in or not
app.use('/admin', admin);


// // 错误处理函数
app.use(function (err, req, res, next) {
    let result = JSON.parse(err);
    let stringAfterQuestionMark = [];
    for(let attr in result){
        if (attr != 'path') {
            stringAfterQuestionMark.push(attr + '=' + result[attr]); 
        }
    }
    res.redirect(`${result.path}?${stringAfterQuestionMark.join('&')}`); // ES6 way
});

// 捕获404错误
// app.use(function (req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// // 错误处理函数
// app.use(function (err, req, res, next) {
//     // 设置环境，只在development环境才会打印错误信息
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     // 渲染错误页面
//     res.status(err.status || 500);
//     res.render('error');
// });


// listen on port 80
app.listen(80, "localhost", () => {
    console.log("Request is successfully processed listened on port 80");
});