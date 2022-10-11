const express = require('express');
const viewController = require('../controllers/view');

const router = express.Router();

router.get('/', viewController.getIndex);
router.get('/delete/infoMessage/:id', viewController.deleteInfoMessage);


module.exports = router;
