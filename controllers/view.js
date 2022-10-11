

exports.deleteInfoMessage = (req, res, next) => {

    req.session.flash.info.splice(req.params.id, 1);
    res.status(200).redirect(req.headers.referer);
};


exports.getIndex = async (req, res, next) => {

    return res.status(200).render('view/index', {
        pageTitle: 'index',
        path: '/',
        isAuthenticated: req.session.isLoggedIn,
        errors: [],
        oldInput: {},
        validationErrors: [],
        messages: req.session.flash
    });


};

