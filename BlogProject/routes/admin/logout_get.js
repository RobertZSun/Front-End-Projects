function logoutForGet(req, res) {
    req.session.destroy(()=>{
        res.clearCookie('mysid');
        req.app.locals.userInfo = null;
        console.log("logout success!");
        
        res.redirect('/admin/login');
        // res.redirect('/home');
    });
}

module.exports.logoutForGet = logoutForGet;