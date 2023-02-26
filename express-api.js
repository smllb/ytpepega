const express = require('express');
const fs = require('fs');
const cors = require('cors');
const exp = express();

// Read settings from file
//const apiKey = JSON.parse(fs.readFileSync('./settings/settings.json')).apiKey.toString();

//raw path cuz i'm running this through the terminal
const apiKey = JSON.parse(fs.readFileSync('/home/yogi/Documents/js/ytpepega/settings/settings.json')).apiKey.toString();

exp.use(cors());

// Define route to expose settings
exp.get('/key', (req, res) => {
  console.log("Retrieving apikey")
  res.json(apiKey);
  
});

// Start server
const PORT = 3000;
exp.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = exp;