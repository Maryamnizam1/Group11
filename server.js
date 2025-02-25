require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
// server port
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});


// backend serves
require('./Group11-main/Routes/User.Routes')(app);









// Calories API route
app.get('/api/calories', async (req, res) => {
  try {
    const query = req.query.food;
    const response = await axios.get('https://api.calorieninjas.com/v1/nutrition', {
      params: { query },
      headers: {
        'X-Api-Key': process.env.CALORIE_NINJA_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calorie information' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
