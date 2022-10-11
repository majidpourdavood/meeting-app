const path = require('path');

const express = require('express');
const panelController = require('../controllers/panel');
const isAuth = require('../middleware/is-auth');
const NotificationController = require('../controllers/panel/notification');
const MeetingController = require('../controllers/panel/meeting');
const router = express.Router();


router.get('/dashboard',[isAuth ], panelController.panelDashboard);
router.get('/notifications',[isAuth  ], NotificationController.index);
router.post('/delete/notification/:notificationID',[isAuth ], NotificationController.destroy);



router.get('/meetings',[isAuth  ], MeetingController.index);
router.get('/create/meeting',[isAuth ], MeetingController.create);
router.post('/store/meeting',[isAuth ], MeetingController.store);


module.exports = router;
