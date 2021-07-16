// Import express
const express = require('express');

// Import routes.js
const routes = require('./routes');

// Init express
const app = express();

// Init port
const port = 5000;

// Use express
app.use(express.json());

// Use routes
app.use(routes);

// Listen on port
app.listen(port, () => {
    console.log(`Server berjalan pada http://localhost:${port}`);
});