const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Validator = require('validatorjs');

exports.getLogin = async (req, res, next) => {
    console.log(req.session);

    return res.status(200).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errors: [],
        oldInput: {},
        validationErrors: [],
        messages: req.session.flash
    });
};

exports.getSignup = async (req, res, next) => {


    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',

        errors: [],
        oldInput: {},
        validationErrors: [],
        messages: req.session.flash

    });
    // }
};


exports.postLogin = async (req, res, next) => {


    let email = req.body.email;
    let password = req.body.password;

    let data = {
        email: email,
        password: password,
    };
    let rules = {
        email: 'required|email',
        password: 'required',
    };
    Validator.useLang('en');

    let validation = new Validator(data, rules);

    if (validation.fails()) {
        console.log(validation.errors);

        let errors = [];
        let vals = [];
        for (nnn in validation.errors.all()) {
            validation.errors.get(nnn).forEach(function (item) {
                errors.push(item);
                vals.push(nnn);
            });
        }

        return res.status(200).render('auth/login', {
            path: '/login',
            pageTitle: 'login',
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword
            },
            errors: errors,
            validationErrors: vals,
            messages: req.session.flash
        });

    }


    try {
        await User.findOne({email: email})
            .then(user => {
                if (!user) {
                    req.flash('info', 'کاربر وجود ندارد!!');
                    return res.redirect('/login');
                }

                bcrypt
                    .compare(password, user.password)
                    .then(doMatch => {
                        if (doMatch) {
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            return req.session.save(err => {
                                res.status(200).redirect('/panel/dashboard');

                            });
                        } else {
                            req.flash('info', ' پسورد اشتباه است!!');
                            res.redirect('/login');
                        }

                    })
                    .catch(err => {
                        res.redirect('/login');
                    });
            })
            .catch(err => {
                res.redirect('/login');
            });
    } catch (err) {
        next(err);
        res.redirect('/login');
    }


};

exports.postSignup = (req, res, next) => {


    let email = req.body.email;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    let data = {
        email: email,
        password: password,
    };
    let rules = {
        email: 'required|email',
        password: 'required|min:6',
    };
    Validator.useLang('en');

    let validation = new Validator(data, rules);

    if (validation.fails()) {
        console.log(validation.errors);

        let errors = [];
        let vals = [];
        for (nnn in validation.errors.all()) {
            validation.errors.get(nnn).forEach(function (item) {
                errors.push(item);
                vals.push(nnn);
            });
        }

        return res.status(200).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword
            },
            errors: errors,
            validationErrors: vals,
            messages: req.session.flash
        });

    }


    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    });
};

