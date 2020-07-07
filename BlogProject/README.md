# Personal Blog System
Author:  Robert Z.Sun

***

Using **Express structure** to build this app, and **MongoDB** database to store the data,  

adopted **bcrypt** module to encrypt the sensitive Information like password, 

and used **joi** module to validate the user submitted data, like submitting a article/new user form.

used **art-template** to simplify the page data rendering

used **express-session** to keep the login status

used **morgan** module to get verbose request information on server side when in development environment

powered by **Bootstrap**



## How to run the project

 ##### First

create a **system variable** named **NODE_ENV**( the value is one of the  production, development and test) in advanced system setting by right click on my computer and click property,

then create another variable **MD_Blog_pwd** which has the value of password to the MongoDB database to create the connection, the default is ______

```
	npm install
```
##### Second
```
	npm run build
```



##### Then these info will show up and you are good to go

```
PS D:\myWeb\ajax\BlogProject> npm run build

> blogproject@1.0.0 build D:\myWeb\ajax\BlogProject
> nodemon ./app.js

[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./app.js`
development environment
Request is successfully processed listened on port 80
Database is connected!
```



##### PS： my   app.js for reference

```javascript
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
```

### Here is what the project look like:

![image](https://img-blog.csdnimg.cn/2020070709401419.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjY1NTcxNw==,size_16,color_FFFFFF,t_70)

![image](https://img-blog.csdnimg.cn/20200707094006588.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjY1NTcxNw==,size_16,color_FFFFFF,t_70)

![image](https://img-blog.csdnimg.cn/20200707093956679.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjY1NTcxNw==,size_16,color_FFFFFF,t_70)

![image](https://img-blog.csdnimg.cn/20200707093831726.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjY1NTcxNw==,size_16,color_FFFFFF,t_70)

![image](https://img-blog.csdnimg.cn/20200707094301224.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjY1NTcxNw==,size_16,color_FFFFFF,t_70)

![image](https://img-blog.csdnimg.cn/2020070709382227.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjY1NTcxNw==,size_16,color_FFFFFF,t_70)

![image](https://img-blog.csdnimg.cn/20200707094245896.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjY1NTcxNw==,size_16,color_FFFFFF,t_70)