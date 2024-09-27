require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import Express framework
const { Pool } = require('pg'); // Import PostgreSQL client
const app = express(); // Initialize Express app

// Configure the PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER, // Database user
  host: process.env.DB_HOST, // Database host
  database: process.env.DB_NAME, // Database name
  password: process.env.DB_PASSWORD, // Database password
  port: process.env.DB_PORT, // Database port
});

// Basic route to check if the service is running
app.get('/', (req, res) => {
  res.send('Realm Service is Running'); // Send response to root route
});

// Route to test database connection
app.get('/test-db', async (req, res) => {
  try {
    const client = await pool.connect(); // Connect to the PostgreSQL client
    const result = await client.query('SELECT NOW()'); // Execute a simple query
    client.release(); // Release the client back to the pool
    res.send(result.rows); // Send the result of the query
  } catch (err) {
    console.error(err); // Log any errors
    res.send("Error " + err); // Send error response
  }
});

// Set the port to listen on, using environment variable or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log server startup message
});

