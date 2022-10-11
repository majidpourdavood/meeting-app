const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Validator = require('validatorjs');
const moment = require('jalali-moment');

const User = require('../../../models/user');
const Helpers = require('../../../util/helpers');
const momment = require("jalali-moment");


exports.auth = async (req, res, next) => {


    const email = req.body.email;
    const password = req.body.password;

    let data = {
        email: email,
        password: password,
    };
    let rules = {
        email: 'required|email',
        password: 'required|min:6',
    };

    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('email').length > 0) {

            validation.errors.get('email').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "email";
                element.originalValue = email;
                element.extraData = "";
                errors.push(element);
                //
            });
        }
        if (validation.errors.get('password').length > 0) {

            validation.errors.get('password').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "password";
                element.originalValue = password;
                element.extraData = "";
                errors.push(element);
                //
            });
        }

        let response = Helpers.sendJson(0, errors,
            "ValidationError", "ValidationError", {});
        return res.status(400).json(response);
    } else {


        try {
            await User.findOne({email: email})
                .then(user => {
                    if (!user) {
                        let response2 = Helpers.sendJson(0, [],
                            "not exist user", "Fail", {});
                        return res.status(404).json(response2);
                    }

                    bcrypt
                        .compare(password, user.password)
                        .then(doMatch => {
                            if (doMatch) {

                                const token = jwt.sign(
                                    {
                                        email: user.email,
                                        userId: user._id.toString()
                                    },
                                    process.env.ACCESS_TOKEN_SECRET,
                                    {expiresIn: process.env.ACCESS_TOKEN_LIFE}
                                );
                                const refreshToken = jwt.sign({
                                        email: user.email,
                                        userId: user._id.toString()
                                    }, process.env.REFRESH_TOKEN_SECRET,
                                    {expiresIn: process.env.REFRESH_TOKEN_LIFE});


                                let expireToken = moment().unix() + parseInt(process.env.ACCESS_TOKEN_LIFE) / 1000;
                                let expireRefreshToken = moment().unix() + parseInt(process.env.REFRESH_TOKEN_LIFE) / 1000;
                                let userData = {
                                    "email": user.email + "",
                                    "expireType" : "timestamp seconds",
                                    "token": token + "",
                                    "expireToken": expireToken + "",
                                    "refreshToken": refreshToken + "",
                                    "expireRefreshToken": expireRefreshToken + "",
                                    "name": user.name == null ? "" : user.name + "",
                                    "lastName": user.lastName == null ? "" : user.lastName + "",
                                };


                                let response = Helpers.sendJson(1, [],
                                    "success", "success", userData);

                                return res.status(200).json(response);



                            } else {
                                let response2 = Helpers.sendJson(0, [],
                                    "password wrong", "Fail", {});
                                return res.status(400).json(response2);
                            }

                        })
                        .catch(err => {
                            let response2 = Helpers.sendJson(0, [],
                                "error server", "Fail", {});
                            return res.status(500).json(response2);
                        });
                })
                .catch(err => {
                    let response2 = Helpers.sendJson(0, [],
                        "error server", "Fail", {});
                    return res.status(500).json(response2);
                });
        } catch (err) {
            let response2 = Helpers.sendJson(0, [],
                "error server", "Fail", {});
            return res.status(500).json(response2);
        }




    }


};

