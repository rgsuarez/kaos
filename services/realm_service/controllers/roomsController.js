// controllers/roomsController.js
const Room = require('../models/roomModel');
const { checkAndFixBidirectionalConnections } = require('../utils/fixConnections'); // Ensure proper import

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.getAllRooms();
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching rooms");
  }
};

// Get a room by UUID
const getRoomByUUID = async (req, res) => {
  const { uuid } = req.params;
  try {
    const room = await Room.getRoomByUUID(uuid);
    if (room) {
      res.json(room);
    } else {
      res.status(404).send('Room not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching room");
  }
};

// Get a room by ID
const getRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.getRoomById(id);
    if (room) {
      res.json(room);
    } else {
      res.status(404).send('Room not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching room");
  }
};

// Create a new room
const createRoom = async (req, res) => {
  const { name, description, safe_haven } = req.body;
  try {
    const newRoom = await Room.createRoom(name, description, safe_haven);
    res.json(newRoom);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating room");
  }
};

// Create a connection between rooms
const createRoomConnection = async (req, res) => {
  const { roomId } = req.params;
  const { connectedRoomId, direction, bidirectional } = req.body;

  // Set bidirectional to true by default unless explicitly false
  const isBidirectional = bidirectional !== false;

  try {
    const newConnection = await Room.createRoomConnection(roomId, connectedRoomId, direction, isBidirectional);

    // Check and fix bidirectional connections if bidirectional flag is true
    if (isBidirectional) {
      await checkAndFixBidirectionalConnections(); // Properly call the function
    }

    res.json(newConnection);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating connection");
  }
};

// Get all connections for a specific room
const getRoomConnections = async (req, res) => {
  const { roomId } = req.params;
  try {
    const connections = await Room.getRoomConnections(roomId);
    res.json(connections);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching connections");
  }
};

// Function to navigate a player from one room to another
const navigateRoom = async (req, res) => {
  const { roomId } = req.params;
  const { direction } = req.body;

  try {
    // Find the connected room in the given direction
    const connectedRoom = await Room.findRoomInDirection(roomId, direction);

    if (connectedRoom) {
      res.json({
        message: `You have moved ${direction} to the room: ${connectedRoom.name}`,
        room: connectedRoom
      });
    } else {
      res.status(404).send(`No room found in the direction ${direction}`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error navigating room");
  }
};

module.exports = {
  getAllRooms,
  getRoomByUUID,
  getRoomById,
  createRoom,
  createRoomConnection,
  getRoomConnections,
  navigateRoom, // Export navigateRoom function
};

