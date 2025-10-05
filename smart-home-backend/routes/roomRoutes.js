const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/:roomId', roomController.getRoomData);
router.get('/components/all', roomController.getAllComponents);
router.patch('/components/:id/control', roomController.controlComponent);

module.exports = router;