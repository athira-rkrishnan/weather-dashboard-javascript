# Advanced Weather Dashboard
A responsive and dynamic full-stack weather dashboard built using HTML, CSS, JavaScript, Node.js, and Express.js. The application fetches real-time weather data from the OpenWeatherMap API and displays current weather conditions, hourly weather forecast, 7-day forecast, air quality index, sunrise/sunset timings, and dynamic weather-based background images.

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

**Backend Features**
- Secure API handling using Node.js & Express.js
- Environment variables using dotenv
- API key hidden securely using environment variables
- REST API routes for weather, forecast, AQI, reverse geocoding, and city suggestions
- CORS enabled for frontend-backend communication
- Frontend communicates securely with backend APIs instead of exposing API keys in client-side code


## Live Demo


## Deployment
Frontend deployed on:
* **GitHub Pages:** [View Demo]()
* **Netlify:**  [View Demo]()
* **Vercel:**  [View Demo]()

Backend deployed on:
* **Render:** [View Demo]()
* **Railway:**  [View Demo]()

## Responsive Design Screenshots
- Mobile: 320px – 480px  [View]()
- Tablet: 481px – 768px  [View]()
- Small Desktop: 769px – 1024px  [View]()
- Large Desktop: 1025px – 1500px [View]()

## Technologies Used
- HTML5 & CSS3
- JavaScript (ES6+)
- Node.js
- Express.js
- OpenWeatherMap API (via Express.js backend)
- Chart.js for hourly temperature graph
- Font Awesome for icons

## How to Run Locally
1. Clone the repository:
```bash
git clone 
```
2. Install backend dependencies
```bash 
cd backend
npm install 
```
3. Create a .env file inside backend folder
```bash 
API_KEY = your_openweathermap_api_key
```
4. Start backend server
```bash
npm run dev
```
5. Open the frontend folder in VS Code.
6. Run the frontend using Live Server.
7. Make sure backend server is running on localhost:3000.
8. Search for a city or use your current location.
9. Toggle temperature units and themes as desired.

## Customization

- Add your OpenWeatherMap API key inside the backend `.env` file.
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

