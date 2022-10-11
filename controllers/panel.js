
exports.panelDashboard = async (req, res, next) => {

    res.render('panel/dashboard', {
        pageTitle: 'dashboard',
        path: '/panel/dashboard',
        isAuthenticated: req.session.isLoggedIn,
        messages: req.session.flash,
    });

};
