// utils/fixConnections.js
const { Pool } = require('pg');

// Hard-coded database credentials
const pool = new Pool({
  user: 'kaosuser',
  host: 'localhost',
  database: 'kaos',
  password: 'easypass',
  port: 5432,
});

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

// Function to check and fix bidirectional connections
const checkAndFixBidirectionalConnections = async () => {
  try {
    const client = await pool.connect();

    // Get all connections
    const result = await client.query('SELECT * FROM room_connections');
    const connections = result.rows;

    // Iterate over each connection to check for bidirectional references
    for (const connection of connections) {
      const { room_id, connected_room_id, direction } = connection;
      const oppositeDirection = getOppositeDirection(direction);

      if (oppositeDirection) {
        // Check if the opposite connection exists
        const oppositeConnectionResult = await client.query(
          'SELECT * FROM room_connections WHERE room_id = $1 AND connected_room_id = $2 AND direction = $3',
          [connected_room_id, room_id, oppositeDirection]
        );

        // If not, create the missing connection
        if (oppositeConnectionResult.rows.length === 0) {
          await client.query(
            'INSERT INTO room_connections (room_id, connected_room_id, direction) VALUES ($1, $2, $3)',
            [connected_room_id, room_id, oppositeDirection]
          );
          console.log(`Created missing connection from ${connected_room_id} to ${room_id} in direction ${oppositeDirection}`);
        }
      }
    }

    client.release();
  } catch (err) {
    console.error('Error checking and fixing bidirectional connections:', err);
  }
};

// Export the function
module.exports = {
  checkAndFixBidirectionalConnections
};

// If you want this script to run standalone, uncomment below
// checkAndFixBidirectionalConnections().then(() => {
//   console.log('Bidirectional connection check complete.');
//   pool.end(); // Close the pool when done
// });

