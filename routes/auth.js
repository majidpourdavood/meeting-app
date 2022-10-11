
const express = require('express');

const authController = require('../controllers/auth');
const redirectAthenticated = require('../middleware/redirectAthenticated');

const router = express.Router();

router.get('/login', [redirectAthenticated], authController.getLogin);

router.get('/signup', [redirectAthenticated], authController.getSignup);


router.post(
    '/login',
    authController.postLogin
);

router.post(
    '/signup',
    authController.postSignup
);
router.post('/logout', authController.postLogout);

module.exports = router;

