const express = require('express');
const { body } = require('express-validator');

const authController = require('../../controllers/api/v1/auth');
const jwtMiddleware = require('../../middleware/api/is-auth');

const router = express.Router();

router.post('/v1/auth/login', authController.auth);

module.exports = router;
