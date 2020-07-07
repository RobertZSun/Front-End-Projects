const mongoose = require('mongoose');
const config = require('config');

/**
 * define variables
 * */
const dbLink = `mongodb://${config.get('db.user')}:${config.get('db.pwd')}@${config.get('db.host')}:${config.get('db.port')}/${config.get('db.name')}`; // default port for MongoDB is 27017
// const dbLink = 'mongodb://username:pwd@localhost:27017/blog'; // default port for MongoDB is 27017


/**
 * **************** database connect START ****************
 */

mongoose.connect(dbLink, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("数据库连接成功!");
    })
    .catch((err) => {
        console.log("数据库连接**失败**!" + err);
    });

/**
 * **************** database connect method END ****************
 */