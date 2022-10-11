const Meeting = require('../../models/meeting');
const Helpers = require('../../util/helpers');
const Validator = require('validatorjs');
const moment = require('jalali-moment');

exports.index = async (req, res, next) => {

    let userId = req.session.user._id;

    await Meeting.find(
        {
            userId: userId
        }
    )
        .sort({'createdAt': 'desc'}).then(async meetings => {
            let array = [];

            for (let cate of meetings) {
                let element = {};

                let createdAt = moment(cate.createdAt).locale('en').format('YYYY-MM-DD H:mm:ss A');
                let startDate = moment(cate.createdAt).locale('en').format('YYYY-MM-DD H:mm:ss A');
                let endDate = moment(cate.createdAt).locale('en').format('YYYY-MM-DD H:mm:ss A');
                let updatedAt = moment(cate.createdAt).locale('en').format('YYYY-MM-DD H:mm:ss A');

                element._id = cate.id;
                element.createdAt = cate.createdAt ? createdAt : " --";
                element.startDate = cate.startDate ? startDate : " --";
                element.endDate = cate.endDate ? endDate : " --";
                element.updatedAt = cate.updatedAt ? updatedAt : " --";

                array.push(element);
            }

            res.render('panel/meeting/index', {
                meetings: array,
                pageTitle: 'meetings',
                path: '/panel/meetings',
                isAuthenticated: req.session.isLoggedIn,
                messages: req.session.flash
            });
        })
        .catch(err => {
            return next(err);
        });


};

exports.create = async (req, res, next) => {

    res.render('panel/meeting/create', {
        pageTitle: 'create meetings',
        path: '/panel/create/meeting',
        errors: [],
        oldInput: {},
        validationErrors: [],
        messages: req.session.flash
    });


};

exports.store = async (req, res, next) => {

    let startDate = req.body.startDate;
    let endDate = req.body.endDate;


    let userId = req.session.user._id

    let data = {
        startDate: startDate,
        endDate: endDate,
    };
    let rules = {
        startDate: 'required',
        endDate: 'required',
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

        return res.status(200).render('panel/meeting/create', {
            pageTitle: 'create meeting',
            path: '/panel/create/meeting',
            oldInput: {
                startDate: startDate,
                endDate: endDate,

            },
            errors: errors,
            validationErrors: vals,
            messages: req.session.flash
       });


    }




    try {


        const meeting = await new Meeting({
            startDate: startDate,
            endDate: endDate,
            userId: userId,

        });
        meeting.save();
        return res.redirect('/panel/meetings');


    } catch (error) {
        console.log(error)
        return next(error);
    }


};

