// import the user collection of the database
const User = require('../../model/user').User;
const bcrypt = require('bcrypt');

async function loginForPost(req, res) {
    // parse the posted data value
    let {
        email,
        password
    } = req.body;

   // double check the email and password are existed
    if (email.trim().length == 0 || password.trim().length == 0) {
        res.status(400).render('admin/error', {
            errorMessage: '<h4>Bad Request: Sth is wrong with the Email or Password</h4>',
        });
        return;
    }

    // query user in the database
    let userResult = null;
    await User.findOne({
        email: email,
    }).then((result) => {
        userResult=result;
        // console.log(result);
    }).catch((err) => {
        console.log(err);
    })


    // if the user data is existed
    if (userResult) {
        // check if the password matches the password in database
        let compareResult =await bcrypt.compare(password,userResult.password);
        if (compareResult) {
            req.session.username = userResult.username;
            req.session.role = userResult.role;
            // res.send('success');
            req.app.locals.userInfo = userResult;
            console.log(userResult);
            
            // reirect to /admin/user page
            if (userResult.role == 'admin') {
                res.redirect('/admin/user');
                return;
            } else {
                res.redirect('/home/');
                return;
            }
        } else {
            res.status(400).render('admin/error', {
                errorMessage: '<h4>Bad Request: Sth is wrong with the Email or Password</h4>',
            });
        }
    } else {
        res.status(400).render('admin/error', {
            errorMessage: '<h4>Bad Request: Sth is wrong with the Email or Password</h4>',
        });
    }
}

module.exports.loginForPost = loginForPost;