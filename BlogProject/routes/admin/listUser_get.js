const User = require('../../model/user').User;

async function listUserForGet(req, res) { 

    // req.app.locals.currentLink = 'user';
    res.locals.currentLink = 'user';

    let currentPage = req.query.page || 1;
    let itemNumInPerPage = 5;
    let sumOfUsers = await User.countDocuments();
    let totalPageNum = Math.ceil(sumOfUsers / itemNumInPerPage);
    let pastItems = (currentPage - 1) * itemNumInPerPage;
    let allUserInfo = null;
    await User.find().limit(itemNumInPerPage).skip(pastItems).then((result) => {
        allUserInfo = result;
    }).catch((err) => {
        console.log(err);
    });
    res.render('admin/user', {
        userList: allUserInfo,
        totalNumOfUsers: sumOfUsers,
        currentPage: currentPage,
        totalPageNum:totalPageNum,
    });
    console.log("welcome to list user page ");
}

module.exports.listUserForGet = listUserForGet;