const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

const apiKey = '7012461f91119af5358bcba2795b0e48';

// Endpoint to handle GET requests to /api/hello
app.get('/api/hello', async (req, res) => {
  try {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';
    const city = req.query.city || 'New York'; // Default city if not provided in query params

    // Fetch weather data for the specified city
    const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const weatherResponse = await axios.get(weatherApiUrl);

    // Extract relevant weather information
    const temperature = weatherResponse.data.main.temp;
    const weatherDescription = weatherResponse.data.weather[0].description;

    // Construct the response object
    const response = {
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city}. It's ${weatherDescription}.`
    };

    // Send the response as JSON
    res.json(response);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
