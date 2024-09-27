require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get('/', (req, res) => {
  res.send('Realm Service is Running');
});

// Get all rooms with id and safe_haven attribute included
app.get('/rooms', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM rooms');
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Get a specific room by UUID
app.get('/rooms/:uuid', async (req, res) => {
  const { uuid } = req.params;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM rooms WHERE uuid = $1', [uuid]);
    client.release();
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Room not found');
    }
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Get a specific room by ID
app.get('/rooms/id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM rooms WHERE id = $1', [id]);
    client.release();
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Room not found');
    }
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Create a new room with optional safe_haven attribute
app.post('/rooms', async (req, res) => {
  const { name, description, safe_haven } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO rooms (name, description, safe_haven) VALUES ($1, $2, $3) RETURNING *',
      [name, description, safe_haven || false]
    );
    client.release();
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

