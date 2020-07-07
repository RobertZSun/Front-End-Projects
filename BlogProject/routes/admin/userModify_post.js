const User = require('../../model/user').User;
const validateUser = require('../../model/user').validateUser;
const bcrypt = require('bcrypt');


async function modifyUserForPost(req, res, next) {

    // get the date from get request
    let id = req.query.id;
    // get the data from post request
    let {
        username,
        email,
        role,
        status,
        password,
    } = req.body

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

    let queriedUser = null;
    await User.findById(id, (err, data) => {
        if (err) {
            console.log(err);
        }
        queriedUser = data;
        // console.log(queriedUser);

    });
    let compareResult = await bcrypt.compare(password, queriedUser.password);
    // password matches the one in the database
    if (compareResult) {

        await User.findByIdAndUpdate(
            id, {
                username: username,
                email: email,
                role: role,
                status: status,
            }, {
                new: true
            }, (err, result) => {
                if (err) {
                    outputError(err);
                }
                console.log(result);
            });

        res.redirect('/admin/user');

    } else {
        // password doesn't match
        next(JSON.stringify({
            path: '/admin/user-edit',
            id: queriedUser._id,
            message: queriedUser.email + " user's password doesn't match, cannot update user",
        }));
        // res.redirect(`/admin/user-edit?message=${userResult.email}`);
        return;
    }
}

module.exports.modifyUserForPost = modifyUserForPost;