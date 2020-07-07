// import the user collection of the database
const User = require('../../model/user').User;

async function addUserForGet(req, res, next) {

    // req.app.locals.currentLink = 'user';
    res.locals.currentLink = 'user';
    const {
        message,
        id,
    } = req.query;

    if (message && id) {
        await User.findById(id, (err, data) => {
            if (err) {
                next(err);
            }
            res.render('admin/user-edit', {
                errMsg: message,
                userEmailInfo: id,
                userToBeUpdatedData: data,
                actionLink: `/admin/user-modify?id=${id}`,
                buttonText: 'Update',
            });
            return;
        });
    } else if (message) {
        // console.log(message);
        res.render('admin/user-edit', {
            errMsg: message,
            actionLink: '/admin/user-edit',
            buttonText: 'Add',
        });
    } else if (id) {
        await User.findById(id, (err, data) => {
            if (err) {
                next(err);
            }
            res.render('admin/user-edit', {
                errMsg: message,
                userEmailInfo: data.email,
                userToBeUpdatedData: data,
                actionLink: `/admin/user-modify?id=${id}`,
                // actionLink: '/admin/user-modify?id='+id,
                buttonText: 'Update',
            });
            return;
        });
    } else {
        res.render('admin/user-edit', {
            actionLink: '/admin/user-edit',
            buttonText: 'Add',
        });
    }
}

module.exports.addUserForGet = addUserForGet;