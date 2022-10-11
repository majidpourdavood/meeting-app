const Validator = require('validatorjs');
const moment = require('jalali-moment');
const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const Meeting = require('../../../models/meeting');
const Helpers = require('../../../util/helpers');


//  get meetings
exports.getMeetings = async (req, responseA, next) => {


    let email = req.email;

    let userAuth;
    try {
        userAuth = await User.findOne({
            email: email
        });
    } catch (error) {

        if (!error.statusCode) {
            let resJson = Helpers.sendJson(0, [],
                error.toString(), "Fail", {});
            return responseA.status(500).json(resJson);
        }
        let resJson = Helpers.sendJson(0, [],
            error.toString(), "Fail", {});
        return responseA.status(error.statusCode).json(resJson);

    }


    let page = typeof (req.query.page) != "undefined" && req.query.page !== null && req.query.page !== "" ? req.query.page : 1;
    let paginate = typeof (req.query.limit) != "undefined" && req.query.limit !== null && req.query.limit !== "" ? req.query.limit : 10;

    let limit = parseInt(paginate);
    var skip = (page * limit) - limit;


    let query = {
        userId: userAuth._id,
    };

    let pages;
    let counts;

    await Meeting.countDocuments(query, function (err, count) {
        pages = Math.ceil(count / limit);
        counts = count;
    });


    try {
        await Meeting.find(query)
            .skip(skip)
            .sort({'createdAt': 'desc'})
            .limit(limit).exec(
                async function (err, meetings) {

                    if (meetings.length > 0) {
                        let data = [];
                        for (item of meetings) {

                            let userA;
                            try {
                                userA = await User.findOne({
                                    _id: item.userId
                                });
                            } catch (error) {
                                let resJson = Helpers.sendJson(0, [],
                                    "not found user", "Fail", {});
                                return responseA.status(404).json(resJson);
                            }



                            let element = {};


                            let createdAt = moment(item.createdAt).locale('en').format('YYYY-MM-DD H:mm:ss A');
                            let startDate = moment(item.createdAt).locale('en').format('YYYY-MM-DD H:mm:ss A');
                            let endDate = moment(item.createdAt).locale('en').format('YYYY-MM-DD H:mm:ss A');
                            let updatedAt = moment(item.createdAt).locale('en').format('YYYY-MM-DD H:mm:ss A');

                            element._id = item.id;
                            element.createdAt = item.createdAt ? createdAt : " --";
                            element.startDate = item.startDate ? startDate : " --";
                            element.endDate = item.endDate ? endDate : " --";
                            element.updatedAt = item.updatedAt ? updatedAt : " --";

                            data.push(element);

                        }


                        let nextPage = page;
                        let linkNext = "";
                        nextPage++;

                        if (pages < nextPage) {
                            linkNext = "";
                        } else {
                            linkNext = process.env.URL_WEBSITE + "api/v1/panel/getMeetings?" + queryJson + "&page=" + nextPage + "&limit=" + limit;
                        }


                        let dataJSon = {
                            "meetings": {
                                "lists": data,
                                "limit": limit + "",
                                "currentPage": page + "",
                                "pages": pages + "",
                                "counts": counts + "",
                                "linkNext": linkNext + "",
                            }
                        };

                        let resJson2 = Helpers.sendJson(1, [],
                            "success", "ShowMeeting", dataJSon);
                        return responseA.status(200).json(resJson2);

                    } else {
                        let resJson = Helpers.sendJson(0, [],
                            "error server", "Fail", {});
                        return responseA.status(500).json(resJson);
                    }
                });
    } catch (error) {

        let resJson = Helpers.sendJson(0, [],
            "error server", "Fail", {});
        return responseA.status(500).json(resJson);
    }

};

//  get meeting
exports.getMeeting = async (req, responseA, next) => {

    let email = req.email;

    let userAuth;
    try {
        userAuth = await User.findOne({
            email: email
        });
    } catch (error) {

        if (!error.statusCode) {
            let resJson = Helpers.sendJson(0, [],
                error.toString(), "Fail", {});
            return responseA.status(500).json(resJson);
        }
        let resJson = Helpers.sendJson(0, [],
            error.toString(), "Fail", {});
        return responseA.status(error.statusCode).json(resJson);

    }

    const meetingID = req.params.meetingID;

    try {
        await Meeting.findOne({
                _id: meetingID,
                userId: userAuth._id,
            },
            async function (err, item) {

                if (!item) {
                    let response = Helpers.sendJson(0, [],
                        " not found meeting", "NotFoundMeeting", {});
                    return responseA.status(500).json(response);
                }else{


                    let element = {};


                    let createdAt = moment(item.createdAt).locale('en').format('YYYY-MM-DD H:mm:ss A');
                    let startDate = moment(item.createdAt).locale('en').format('YYYY-MM-DD H:mm:ss A');
                    let endDate = moment(item.createdAt).locale('en').format('YYYY-MM-DD H:mm:ss A');
                    let updatedAt = moment(item.createdAt).locale('en').format('YYYY-MM-DD H:mm:ss A');

                    element._id = item.id;
                    element.createdAt = item.createdAt ? createdAt : " --";
                    element.startDate = item.startDate ? startDate : " --";
                    element.endDate = item.endDate ? endDate : " --";
                    element.updatedAt = item.updatedAt ? updatedAt : " --";


                    let resJson2 = Helpers.sendJson(1, [],
                        "success", "GetMeeting", element);
                    return responseA.status(200).json(resJson2);
                }


            }).catch(function (error) {
            let response = Helpers.sendJson(0, [],
                error.toString(), "Fail", {});
            return responseA.status(500).json(response);
        });
    } catch (error) {

        let resJson = Helpers.sendJson(0, [],
            "داده ای از سرور دریافت نشد.", "Fail", {});
        return responseA.status(500).json(resJson);
    }


};

