const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// A simple route to test the server
app.get('/', (req, res) => {
  res.send('Hello from the FAQ API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
