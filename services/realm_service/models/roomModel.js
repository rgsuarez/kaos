// models/roomModel.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'kaosuser',
  host: 'localhost',
  database: 'kaos',
  password: 'easypass',
  port: 5432,
});

// Get all rooms
const getAllRooms = async () => {
  const result = await pool.query('SELECT * FROM rooms');
  return result.rows;
};

// Get room by UUID
const getRoomByUUID = async (uuid) => {
  const result = await pool.query('SELECT * FROM rooms WHERE uuid = $1', [uuid]);
  return result.rows[0];
};

// Get room by ID
const getRoomById = async (id) => {
  const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
  return result.rows[0];
};

// Create a new room
const createRoom = async (name, description, safe_haven) => {
  const result = await pool.query(
    'INSERT INTO rooms (name, description, safe_haven) VALUES ($1, $2, $3) RETURNING *',
    [name, description, safe_haven || false]
  );
  return result.rows[0];
};

// Create a bidirectional connection between rooms
const createRoomConnection = async (roomId, connectedRoomId, direction, bidirectional = true) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if the connection already exists
    const existingConnection = await client.query(
      'SELECT * FROM room_connections WHERE room_id = $1 AND direction = $2',
      [roomId, direction]
    );

    if (existingConnection.rows.length > 0) {
      console.log(`Connection already exists from ${roomId} to ${connectedRoomId} in direction ${direction}`);
      await client.query('ROLLBACK');
      return existingConnection.rows[0]; // Return the existing connection
    }

    const result = await client.query(
      'INSERT INTO room_connections (room_id, connected_room_id, direction) VALUES ($1, $2, $3) RETURNING *',
      [roomId, connectedRoomId, direction]
    );

    // Determine opposite direction
    const oppositeDirection = getOppositeDirection(direction);

    if (bidirectional && oppositeDirection) {
      const oppositeExistingConnection = await client.query(
        'SELECT * FROM room_connections WHERE room_id = $1 AND direction = $2',
        [connectedRoomId, oppositeDirection]
      );

      if (oppositeExistingConnection.rows.length === 0) {
        await client.query(
          'INSERT INTO room_connections (room_id, connected_room_id, direction) VALUES ($1, $2, $3)',
          [connectedRoomId, roomId, oppositeDirection]
        );
      }
    }

    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Helper function to get the opposite direction
const getOppositeDirection = (direction) => {
  const directionsMap = {
    north: 'south',
    south: 'north',
    east: 'west',
    west: 'east',
    up: 'down',
    down: 'up'
  };
  return directionsMap[direction] || null;
};

// Get connections for a room
const getRoomConnections = async (roomId) => {
  const result = await pool.query(
    'SELECT * FROM room_connections WHERE room_id = $1',
    [roomId]
  );
  return result.rows;
};

// Function to find a room in a given direction
const findRoomInDirection = async (roomId, direction) => {
  const result = await pool.query(
    'SELECT r.* FROM room_connections rc JOIN rooms r ON rc.connected_room_id = r.uuid WHERE rc.room_id = $1 AND rc.direction = $2',
    [roomId, direction]
  );
  return result.rows[0];
};

module.exports = {
  getAllRooms,
  getRoomByUUID,
  getRoomById,
  createRoom,
  createRoomConnection,
  getRoomConnections,
  findRoomInDirection, // Export findRoomInDirection function
};

