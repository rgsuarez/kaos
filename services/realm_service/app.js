// app.js
const express = require('express');
const bodyParser = require('body-parser');
const roomsController = require('./controllers/roomsController');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Room Routes
app.get('/rooms', roomsController.getAllRooms);
app.get('/rooms/:uuid', roomsController.getRoomByUUID);
app.get('/rooms/id/:id', roomsController.getRoomById);
app.post('/rooms', roomsController.createRoom);
app.post('/rooms/:roomId/connect', roomsController.createRoomConnection);
app.get('/rooms/:roomId/connections', roomsController.getRoomConnections);

// Navigation Route
app.post('/rooms/:roomId/navigate', roomsController.navigateRoom);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

