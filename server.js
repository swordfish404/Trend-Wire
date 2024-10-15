const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY; // Store your API key in a .env file
const url = 'https://newsapi.org/v2/everything';

app.use(cors());

// API endpoint to fetch news articles
app.get('/api/news', async (req, res) => {
    const query = req.query.q || 'India'; // Default query
    try {
        const response = await axios.get(`${url}?q=${query}&apiKey=${API_KEY}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching news:', error.message);
        res.status(500).send('Error fetching news');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
