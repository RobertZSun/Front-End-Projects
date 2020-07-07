// import the user collection of the database
const User = require('../../model/user').User;
const create_A_User = require('../../model/user').create_A_User;
const validateUser = require('../../model/user').validateUser;





async function addUserForPost(req, res, next) {
    try {
        await validateUser(req.body)
    } catch (error) {
        // res.redirect(`/admin/user-edit?message=${error.message}`); // ES6 way
        // res.redirect('/admin/user-edit?message='+error.message);
        next(JSON.stringify({
            path: '/admin/user-edit',
            message: error.message,
        }));
        return;
    }


    // // query user in the database
    let userResult = null;
    await User.findOne({
        email: req.body.email,
    }).then((result) => {
        userResult = result;
    }).catch((err) => {
        console.log(err);
        return;
    })

    if (userResult) {
        next(JSON.stringify({
            path: '/admin/user-edit',
            message: userResult.email + ' already exists, please try another one',
        }));
        // res.redirect(`/admin/user-edit?message=${userResult.email}`);
        return;
    }
    create_A_User(req.body)

    res.redirect('/admin/user');
}

module.exports.addUserForPost = addUserForPost;