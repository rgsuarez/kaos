// routes/roomsRoutes.js
const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');

router.get('/', roomsController.getAllRooms);
router.get('/:uuid', roomsController.getRoomByUUID);
router.get('/id/:id', roomsController.getRoomById);
router.post('/', roomsController.createRoom);
router.post('/:roomId/connect', roomsController.createRoomConnection);
router.get('/:roomId/connections', roomsController.getRoomConnections);

module.exports = router;

