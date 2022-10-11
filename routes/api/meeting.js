const express = require('express');
const meetingsController = require('../../controllers/api/v1/meeting');
const jwtMiddleware = require('../../middleware/api/is-auth');

const router = express.Router();

router.get('/v1/panel/getMeetings',[jwtMiddleware], meetingsController.getMeetings);
router.get('/v1/panel/getMeeting/:meetingID',[jwtMiddleware], meetingsController.getMeeting);


module.exports = router;
