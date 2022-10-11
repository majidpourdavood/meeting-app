
module.exports = (req, res, next) => {

    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }

    if ( req.session.user.active === 0) {
        req.session.destroy(err => {
            console.log(err);
        });
        return res.redirect('/login');
    }

    next();
}