// server.js
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3001; // Ensure this port matches your application's exposed port in the Dockerfile and Kubernetes

// Create a PostgreSQL connection pool
const pool = new Pool({
  // Get the database connection string from an environment variable.
  // This variable will be dynamically injected by your CI/CD process from Key Vault.
  connectionString: process.env.DATABASE_URL
});

// Define an API endpoint to get artworks
app.get('/api/artworks', async (req, res) => {
  try {
    // Query the 'artworks' table from the database
    const result = await pool.query('SELECT * FROM artworks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching artworks:', err);
    res.status(500).json({ error: 'Failed to fetch artworks from the database.' });
  }
});

// Listen on the specified port
app.listen(port, () => {
  console.log(`Backend API listening at http://localhost:${port}`);
});
