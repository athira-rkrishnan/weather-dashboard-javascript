require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 3000;

//Current Weather 
app.get('/weather', async (req, res) => {
    const { city, lat, lon } = req.query;
    let weatherapiURL;
    if(lat && lon) {
        weatherapiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    }
    else if(city) {
        weatherapiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    }
    else {
        return res.status(400).json({
            error: 'City or coordinates required'
        });
    }

    try {
        const response = await fetch(weatherapiURL);
        const data = await response.json();
        res.json(data);
    }
    catch(error) {
        res.status(500).json({
            error: 'Failed to fetch weather data'
        });
    }
});

// AIR QUALITY
app.get('/air-quality', async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch AQI data'
        });
    }
});

// FORECAST 
app.get('/forecast', async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch forecast data'
        });
    }
});

// REVERSE GEOCODING
app.get('/reverse-geocode', async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    try {
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed reverse geocoding'
        });
    }
});

// CITY SUGGESTIONS
app.get('/city-suggestions', async (req, res) => {
    const query = req.query.query;
    try {
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed city suggestions'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


