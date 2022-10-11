const User = require('../../models/user');
const Notification = require('../../models/notification');
const moment = require('jalali-moment');

exports.index = async (req, res, next) => {


    Notification.find()
        .sort({'createdAt': 'desc'})  .lean()
        .then(async (notifications) => {
            await Promise.all(notifications.map(
                async (notification) => {


                    let sender = await User.findOne({_id: notification.senderId});
                    notification.sender = sender ? sender.name + " " + sender.lastName :  "--";

                    let receiver = await User.findOne({_id: notification.receiverId});
                    notification.receiver = receiver ? receiver.name + " " + receiver.lastName :  "--";

                    let data = JSON.parse(notification.data);
                    notification.route = data.route;

                    notification.readAt = notification.readAt ? moment(notification.createdAt).locale('fa').format('YYYY/MM/DD HH:mm:ss') : "null";
                    notification.createdAt = notification.createdAt ? moment(notification.createdAt).locale('fa').format('YYYY/MM/DD HH:mm:ss') : "null";

                }));


            await Notification.find({
                    receiverId: req.session.user._id
                },
                function (err, notificationA) {
                    console.log(notificationA);
                    for (item of notificationA) {

                        item.readAt = moment().toISOString();
                        item.save();
                    }
                }
            );

            res.render('panel/notifications/index', {
                notifications: notifications,
                pageTitle: 'notifications',
                path: '/panel/notifications',
                isAuthenticated: req.session.isLoggedIn,
                messages: req.session.flash
            });
        })
        .catch(err => {
            return next(err)
        })


};

exports.destroy = (req, res, next) => {
    const transactionID = req.params.notificationID;

    Notification.deleteOne({_id: notificationID})
        .then(() => {
            console.log('DESTROYED notification');
            req.flash('info', 'delete success');

            res.redirect('/panel/notifications');
        })
        .catch(function (error) {
            req.flash('info', ' delete failer');

            res.redirect('/panel/notifications');
        });
};