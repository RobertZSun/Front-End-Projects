// const (req, res, next) => {}

// check if the page being requested is login page
// check the state of the user whether logged in
// if the user is logged in, then pass the request
// otherwise redirect to login page
function guard(req, res, next) {
    if (req.url != '/login' &&  !req.session.username) {
        res.redirect('/admin/login');
    }else{
        if (req.session.role == 'normal') {
            if ( req.url == '/logout') {
                next();
                return;
            }
            res.redirect('/home');
        }
        next();
    }
}

module.exports.login_guard = guard;