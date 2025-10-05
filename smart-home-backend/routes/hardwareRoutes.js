const express = require('express');
const router = express.Router();
const hardwareController = require('../controllers/hardwareController');

router.post('/update', hardwareController.updateComponent);
router.post('/bulk-update', hardwareController.bulkUpdate);

module.exports = router;

