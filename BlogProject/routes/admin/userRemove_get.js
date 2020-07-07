const User = require('../../model/user').User;

async function removeUserForGet(req, res,next) {
    // console.log(req.query);
    let userID = req.query.id;
    
    await User.findByIdAndDelete(userID, (err, result) => {
        if (err) {
            next(err);
        }
        console.log("删除成功！",result.username);
    });
    res.redirect('/admin/user');
}

module.exports.removeUserForGet = removeUserForGet;