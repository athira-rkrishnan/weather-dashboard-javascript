# Advanced Weather Dashboard
A responsive and dynamic weather dashboard built with HTML, CSS, and JavaScript. It fetches real-time weather data from OpenWeatherMap API, displays current weather, 7-days forecast, hourly temperature chart, air quality index, and background images that adapt to weather conditions and screen size.

## Features
**Location-Based Weather**
- Search weather by city name
- Get weather using current location (Geolocation API)
- Autocomplete city suggestions

**Weather Details**
- Current temperature, feels like, high & low
- Weather conditions with icons
- Humidity, pressure, visibility, wind speed, UV Index, and rain probability

**Forecast**
- 7-day weather forecast
- Hourly temperature chart using Chart.js

**Air Quality Index**
- AQI value with category (Good, Moderate, Poor, etc.)
- Detailed pollutants: PM2.5, PM10, SO₂, NO₂, O₃, CO

**Sunrise & Sunset**
- Sunrise & sunset timings
- Day length calculation

**UI/UX Features**
- Fully responsive design (Mobile, Tablet, Desktop)
- Dynamic background images based on weather conditions
- Smooth transitions and animations

**Theme Support**
- Dark / Light mode toggle
- Saved user preference using localStorage

**Unit Conversion**
- Toggle between Celsius (°C) and Fahrenheit (°F)

**Error Handling & Alerts**
- User-friendly error messages for invalid input or fetch errors

## Live Demo


## Deployment
This project is hosted on multiple platforms:
* **GitHub Pages:** [View Demo]()
* **Netlify:**  [View Demo]()
* **Vercel:**  [View Demo]()

## Responsive Design Screenshots
- Mobile: 320px – 480px  [View]()
- Tablet: 481px – 768px  [View]()
- Small Desktop: 769px – 1024px  [View]()
- Large Desktop: 1025px – 1500px [View]()

## Technologies Used
- HTML5 & CSS3
- JavaScript (ES6+)
- OpenWeatherMap API for weather data
- Chart.js for hourly temperature graph
- Font Awesome for icons

## How to Use
1. Clone the repository:
```bash
git clone https://github.com/yourusername/weather-dashboard.git
```
2. Open index.html in your browser.
3. Search for a city or use your current location.
4. Toggle temperature units and themes as desired.

## Customization

- Replace the API key in script.js with your own OpenWeatherMap API key.
- Add or update background images for different weather conditions and device sizes.
- Enhance styles as per your preference.

## Challenges Faced
- Handling multiple API calls efficiently using Promise.all.
- Managing state for temperature unit toggle.
- Optimizing chart rendering on different screen sizes.
- Optimizing search with debounce.
- Making complex layouts responsive across devices.

## Future Improvements
- Add loading spinner
- Add weather animations (GIF/video backgrounds)
- Improve accessibility (ARIA support)
- Add PWA support (offline mode)

## Acknowledgements
- OpenWeatherMap API
- Chart.js

## License
This project is open-source. Feel free to fork, modify, and share!

## Contact
Feel free to connect with me on LinkedIn for feedback or collaboration!

⭐ If you like this project, give it a star!

