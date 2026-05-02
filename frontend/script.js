let currentTempData = null;
let dailyForecastData = [];
let lastHourlyData = [];
let currentIconCode = null;
const iconMap = {
            "01d": "assets/01d.png",
            "01n": "assets/01n.png",
            "02d": "assets/02d.png",
            "02n": "assets/02n.png",
            "03d": "assets/03d.png",
            "03n": "assets/03n.png",
            "04d": "assets/04d.png",
            "04n": "assets/04n.png",
            "09d": "assets/09d.png",
            "09n": "assets/09n.png",
            "10d": "assets/10d.png",
            "10n": "assets/10n.png",
            "11d": "assets/11d.png",
            "11n": "assets/11n.png",
            "13d": "assets/13d.png",
            "13n": "assets/13n.png",
            "50d": "assets/50d.png",
            "50n": "assets/50n.png"
};

// Function to update the current time and date display every second
function updateTime() {
    const currDateTime = new Date();
    let hours = currDateTime.getHours();
    let minutes = currDateTime.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = (hours === 0) ? 12 : hours;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("time").textContent = `${hours}:${minutes} ${ampm}`;

    const dateFormat = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    const formattedDate = currDateTime.toLocaleDateString(undefined, dateFormat);
    document.getElementById("date").textContent = formattedDate;
}
setInterval(updateTime, 1000);
updateTime();

const searchIcon = document.getElementById("search-icon");
const searchInput = document.getElementById("search-input");
const locationElement = document.querySelector("#location");
const lctnIcon = document.querySelector(".fa-location-dot");
const locationName = document.getElementById("lctn-name");
const errorPopup = document.getElementById("error-Popup");
const errorMsg = document.getElementById("error-msg");

// Function to display location name based on user input or saved data
function displayLocationName() {
    const value = searchInput.value.trim();
    if(value === "") {
        errorMsg.textContent = "Please enter a city name!";
        errorPopup.style.visibility = "visible";
        locationElement.style.display = "inline";
        locationName.style.display = "none";
        return;
    }
    if(!/^[a-zA-Z\s]+$/.test(value)) {
        errorMsg.textContent = "Invalid city name!";
        errorPopup.style.visibility = "visible";
        locationElement.style.display = "inline";
        locationName.style.display = "none";
        searchInput.value = "";
        return;
    }
    errorPopup.style.visibility = "hidden";
    locationElement.style.display = "inline-block";
    locationElement.style.width = "auto";
    lctnIcon.style.marginRight = "0.1rem";
    locationName.textContent = value;
    locationName.style.display = "inline";
    getWeather(value);
    searchInput.value = "";  
    localStorage.setItem("locationData", JSON.stringify({
        type: "city",
        value: value
    }));     
}
searchIcon.addEventListener("click", displayLocationName);

searchInput.addEventListener("keydown", (event) => {
    if(event.key === "Enter") {
        displayLocationName();
    }
});

// Function to fetch weather, air quality, and forecast data from API 
async function getWeather(locationName, lat, lon) {
    let weatherapiURL;
    if(lat && lon) {
        weatherapiURL = `http://localhost:3000/weather?lat=${lat}&lon=${lon}`;
    }
    else {
        weatherapiURL = `http://localhost:3000/weather?city=${locationName}`;
    }
    const airQualityIndexURL= (lat, lon) => {
        return `http://localhost:3000/air-quality?lat=${lat}&lon=${lon}`;
    };
    const currForecastAPIUrl = (lat, lon) => {
        return `http://localhost:3000/forecast?lat=${lat}&lon=${lon}`;
    };
        
    try {
        const weatherResponse = await fetch(weatherapiURL);
        if(!weatherResponse.ok) {
            throw new Error("Failed to fetch weather data");
        }
        const weatherData = await weatherResponse.json();
        const latitude = weatherData.coord?.lat;
        const longitude = weatherData.coord?.lon;
    
        const airQualityIndexResponse = fetch(airQualityIndexURL(latitude, longitude));
        const currForecastResponse = fetch(currForecastAPIUrl(latitude, longitude));
        const [airQltyIndexRes, currForecastRes] = await Promise.all([airQualityIndexResponse, currForecastResponse]);

        if(!airQltyIndexRes.ok || !currForecastRes.ok) {
            throw new Error("Failed to fetch additional data");
        }
        const airQltyIndexData = await airQltyIndexRes.json();
        const currForecastData = await currForecastRes.json();
        
        const aqi = airQltyIndexData?.list?.[0]?.main?.aqi ?? "N/A";
        const {description, color} = getAirQltyIndexName(aqi);
        const components = airQltyIndexData?.list?.[0]?.components;
        
        const weatherDescription = weatherData.weather?.[0]?.description ?? "N/A";
        const weatherIconCode = weatherData.weather?.[0]?.icon;
        const feelsLike = Math.round(weatherData.main?.feels_like);
        const temp = Math.round(weatherData.main?.temp);
        const highTemp = Math.round(weatherData.main?.temp_max);
        const lowTemp = Math.round(weatherData.main?.temp_min);

        currentIconCode = weatherIconCode;
        updateWeatherBgImg(currentIconCode);
        const iconSrc = iconMap[weatherIconCode] || "assets/cloudy.png";

        const sunriseUnix = weatherData.sys?.sunrise;
        const sunsetUnix = weatherData.sys?.sunset;
        const riseTimeElmnt = document.getElementById("riseTime");
        const setTimeElmnt = document.getElementById("setTime");
        const dayLengthElmnt = document.getElementById("dayLength");

        if(sunriseUnix != null && sunsetUnix != null) {
            const dayLengthSec = sunsetUnix - sunriseUnix;
            const sunriseMillisec = new Date(sunriseUnix * 1000);
            const sunsetMillisec = new Date(sunsetUnix * 1000);
            
            const formattedSunriseTime = sunriseMillisec.toLocaleTimeString([], {
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true
            });
            const formattedSunsetTime = sunsetMillisec.toLocaleTimeString([], {
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true
            });
            riseTimeElmnt.textContent = formattedSunriseTime;
            setTimeElmnt.textContent = formattedSunsetTime;

            if(dayLengthSec > 0) {
                const hours = Math.floor(dayLengthSec / 3600);
                const minutes = Math.floor((dayLengthSec % 3600) / 60);
                dayLengthElmnt.textContent = `${hours}h ${minutes}min`;
            }
            else {
                dayLengthElmnt.textContent = "N/A";
            }
        }
        else {
            riseTimeElmnt.textContent = "N/A";
            setTimeElmnt.textContent = "N/A";
            dayLengthElmnt.textContent = "N/A";
        } 
        
        const uvIndex = currForecastData?.current?.uvi;
        const rainMM = currForecastData?.current?.rain?.["1h"];
        let rainText;
        if(rainMM == null) {
            rainText = "N/A";
        }
        else if(rainMM == 0) {
            rainText = "No rain";
        }
        else {
            const rainPercent = Math.min(Math.round(rainMM * 10), 100);
            rainText = `${rainPercent} %`;
        }
        
        const daysForecastContainer = document.querySelector(".tempLists");
        daysForecastContainer.innerHTML = "";
        const daysForecasts = currForecastData.daily.slice(0, 7);
        dailyForecastData = daysForecasts;
        updateDaysForecast();
        
        const hourlyForecasts = currForecastData.hourly.slice(0, 12);
        lastHourlyData = hourlyForecasts;
        updateHourlyChart(lastHourlyData);

        const humidity = weatherData.main?.humidity ?? "N/A";
        const visibilityMeters = weatherData?.visibility;
        const pressure = weatherData.main?.pressure ?? "N/A";
        const windspeedMetersPerSec = weatherData.wind?.speed;
        const visibilityKm = visibilityMeters != null ? (visibilityMeters / 1000) : "N/A";
        const windspeedKm = windspeedMetersPerSec != null ? (windspeedMetersPerSec * 3.6) : "N/A";
       
        document.querySelector(".weatherImg").src = iconSrc;
        document.querySelector(".weather-name").textContent = weatherDescription.charAt(0).toUpperCase() + 
        weatherDescription.slice(1);
        document.querySelector(".feels-like").textContent = `Feels like ${feelsLike}°C`;
        document.querySelector(".temp-value").textContent = `${temp}°C`;
        document.querySelector(".high").textContent = `High: ${highTemp}`;
        document.querySelector(".low").textContent = `Low: ${lowTemp}`;

        document.getElementById("aqiValue").textContent = `${aqi}`;
        const airIndexName = document.getElementById("airIndexName");
        airIndexName.textContent = description;
        airIndexName.style.backgroundColor = color;
        document.getElementById("pm2.5Value").textContent = components?.pm2_5 != null ? `${components.pm2_5} μg/m3` : "N/A";
        document.getElementById("pm10Value").textContent = components?.pm10 != null ? `${components.pm10} μg/m3` : "N/A";
        document.getElementById("so2Value").textContent = components?.so2 != null ? `${components.so2} μg/m3` : "N/A";
        document.getElementById("no2Value").textContent = components?.no2 != null ? `${components.no2} μg/m3` : "N/A";
        document.getElementById("O3Value").textContent = components?.o3 != null ? `${components.o3} μg/m3` : "N/A";
        document.getElementById("COValue").textContent = components?.co != null ? `${components.co} μg/m3` : "N/A";

        document.getElementById("uvIndex").textContent = uvIndex != null ? `${uvIndex} UV` : "N/A";
        document.getElementById("humidity").textContent = humidity === "N/A" ? "N/A" : `${humidity} %`;
        document.getElementById("visibility").textContent = visibilityKm === "N/A" ? "N/A" : `${visibilityKm} km`;
        document.getElementById("pressure").textContent = pressure === "N/A" ? "N/A" : `${pressure} mb`;
        document.getElementById("windSpeed").textContent = windspeedKm === "N/A" ? "N/A" : `${windspeedKm.toFixed(1)} km/h`;
        document.getElementById("rain").textContent = rainText;

        currentTempData = {
            temp,
            feelsLike,
            highTemp,
            lowTemp
        };
        updateCelsiusFahrenheitTemp();
    }
    catch(error) {
        showErrorAlert("Failed to fetch weather data.");
    }
}

// Function to translate air quality index number to descriptive label and color
function getAirQltyIndexName(aqi) {
    let description = "";
    let color = "";
    switch(aqi) {
        case 1: 
            description = "Good";
            color = "green";
            break;
        case 2: 
            description = "Fair";
            color = "lightgreen";
            break;
        case 3: 
            description = "Moderate";
            color = "yellow";
            break;
        case 4:
            description = "Poor";
            color = "orange";
            break;
        case 5: 
            description = "Very Poor";
            color = "red";
            break;
        default: 
            description = "Unknown";
            color = "gray";
    }
    return {description, color};
}

// Function to update days forecast list in DOM
function updateDaysForecast() {
    const daylistsContainer = document.querySelector(".tempLists");
    const isFahrenheit = tempToggle.checked;
    daylistsContainer.innerHTML = "";
    dailyForecastData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const formattedDate = date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric"
        });

        let temp = Math.round(day.temp.day);
        if (isFahrenheit) {
            temp = convertToFahrenheit(temp);
        }
        const weather = day.weather[0];
        const mainText = weather.main;
        const iconCode = weather.icon;
        const iconSrc = iconMap[iconCode] || "assets/cloudy.png";

        const dayListDiv = document.createElement("div");
        dayListDiv.className = "days-lists";
        dayListDiv.innerHTML = `
            <img src="${iconSrc}">
            <span class="wname">${mainText}</span>
            <span class="nxt-temp">${temp}${isFahrenheit ? "°F" : "°C"}</span>
            <span>${formattedDate}</span>
        `;
        daylistsContainer.appendChild(dayListDiv);
    });
}

// Initialize hourly temperature graph using Chart.js
const canvasEl = document.getElementById("hourChart");
const hourlyChart = new Chart(canvasEl, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature (°C)',
            data: [],
            borderWidth: 1,
            borderColor: 'rgb(8, 163, 163)',
            backgroundColor: 'rgba(42, 245, 152, 1)'
        }]
    },
    options: getHourlyChartOptions()
});

// Function to update hourly chart with new data
function updateHourlyChart(hourlyData) {
    const isFahrenheit = document.getElementById("tempToggle").checked;
    const labels = hourlyData.map(hour => {
        const date = new Date(hour.dt * 1000);
        return date.toLocaleTimeString([], {hour: '2-digit'});
    });
    const hrTemp = hourlyData.map(hour => {
        let temp = Math.round(hour.temp);
        return isFahrenheit ? convertToFahrenheit(temp) : temp;
    });

    hourlyChart.data.datasets[0].label = isFahrenheit 
        ? 'Temperature (°F)' 
        : 'Temperature (°C)';
    hourlyChart.data.labels = labels;
    hourlyChart.data.datasets[0].data = hrTemp;
    hourlyChart.update();
}

// Function to generate options for hourly chart based on window size
function getHourlyChartOptions() {
    const hrChartwidth = window.innerWidth;
    let fontSize, tickLimitX, tickLimitY, rotation, borderWidth, pointRadius;

    if (hrChartwidth <= 480) {
        fontSize = 7;
        tickLimitX = 5;
        tickLimitY = 4;
        rotation = 0;
        borderWidth = 1.3;     
        pointRadius = 1.5;
    } 
    else if (hrChartwidth <= 768) {
        fontSize = 10;
        tickLimitX = 8;
        rotation = 0;
    } 
    else {
        fontSize = 13;
        tickLimitX = 12;
        rotation = 30;
    }
    return {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            line: {
                borderWidth: borderWidth
            },
            point: {
                radius: pointRadius,
                hoverRadius: pointRadius + 2
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'black',
                    font: {
                        size: fontSize + 2,
                        weight: '600'
                    },
                    padding: 2
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'black',
                    font: {
                        size: fontSize
                    },
                    maxRotation: rotation,
                    minRotation: 0,
                    maxTicksLimit: tickLimitX, 
                    padding: 5
                }
            },
            y: {
                ticks: {   
                    color: 'black',
                    font: {
                        size: fontSize
                    },
                    autoSkip: true,
                    maxTicksLimit: tickLimitY,
                    padding: 5
                }
            }
        }
    };
}

// Load current location via Geolocation API
const currLocationBtn = document.querySelector('.curr-location');
currLocationBtn.addEventListener("click", () => {
    loadCurrentLocation();
});

// Function to get current location and fetch weather data
async function loadCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
                const {latitude, longitude} = position.coords;
                try {
                   const geoURL = `http://localhost:3000/reverse-geocode?lat=${latitude}&lon=${longitude}`;
                   const res = await fetch(geoURL);
                   const data = await res.json(); 
                   const cityName = data[0]?.name || "Mumbai";
                   locationElement.style.display = "inline-block";
                   locationElement.style.width = "auto";
                   lctnIcon.style.marginRight = "0.1rem";
                   locationName.textContent = cityName;
                   locationName.style.display = "inline";
                   getWeather(null, latitude, longitude);
                   localStorage.setItem("locationData", JSON.stringify({
                        type: "current",
                        value: cityName,
                        lat: latitude,
                        lon: longitude
                    }));
                }
                catch (error) {
                    showErrorAlert("Unable to fetch location name.");
                }  
            },  (error) => {
                    showErrorAlert('Unable to retrieve your location.');
                }
        );
    } 
    else {
        showErrorAlert('Geolocation is not supported by your browser.');
    }
}

// Utility debounce function to limit API call frequency
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Fetch city suggestions for autocomplete based on user input
async function fetchCitySuggestions(query) {
    const suggestionBox = document.getElementById("suggestion-box");

    if (!query) {
        suggestionBox.innerHTML = '';
        return;
    }
    try {
        const geoCityFetchurl = `http://localhost:3000/city-suggestions?query=${query}`;
        const res = await fetch(geoCityFetchurl);
        const data = await res.json();
        suggestionBox.innerHTML = "";
        data.forEach(city => {
            const div = document.createElement("div");
            div.classList.add("suggestion-item");
            const cityName = `${city.name}, ${city.country}`;
            div.textContent = cityName;
            div.addEventListener("click", () => {
                searchInput.value = city.name;
                suggestionBox.innerHTML = "";
                displayLocationName(); 
            });
            suggestionBox.appendChild(div);
        });
    }
    catch (error) {
        console.error("Error fetching suggestions:", error);
    }
}

// Debounced input event for city suggestions
const debouncedSearch = debounce(fetchCitySuggestions, 300);
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    debouncedSearch(query);
});

// Error alert display function
const errorAlertBox = document.getElementById("error-alert");
const errorAlertMsg = document.getElementById("error-alert-msg");
const closeIcon = document.querySelector(".fa-square-xmark");

closeIcon.addEventListener("click", () => {
    errorAlertBox.classList.remove("show");
});

function showErrorAlert(message) {
    errorAlertMsg.textContent = message;
    errorAlertBox.classList.add("show");
    setTimeout(() => {
        errorAlertBox.classList.remove("show");
    }, 3000);
}

// Conversion from Celsius to Fahrenheit
function convertToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
}

// Function to update temperature display based on toggle (°C/°F)
const tempToggle = document.getElementById("tempToggle");
function updateCelsiusFahrenheitTemp() {
    if (!currentTempData) {
        return;
    }
    const isFahrenheit = tempToggle.checked;
    let { temp, feelsLike, highTemp, lowTemp } = currentTempData;
    if (isFahrenheit) {
        temp = convertToFahrenheit(temp);
        feelsLike = convertToFahrenheit(feelsLike);
        highTemp = convertToFahrenheit(highTemp);
        lowTemp = convertToFahrenheit(lowTemp);
    }
    const unit = isFahrenheit ? "°F" : "°C";
    document.querySelector(".temp-value").textContent = `${temp}${unit}`;
    document.querySelector(".feels-like").textContent = `Feels like ${feelsLike}${unit}`;
    document.querySelector(".high").textContent = `High: ${highTemp}${unit}`;
    document.querySelector(".low").textContent = `Low: ${lowTemp}${unit}`;
}

tempToggle.addEventListener("change", () => {
    updateCelsiusFahrenheitTemp();
    updateHourlyChart(lastHourlyData);
    updateDaysForecast();
    localStorage.setItem("tempUnit", tempToggle.checked ? "F" : "C");
});

// Dark/Light theme toggle button handler
const toggleBtn = document.getElementById("darklightToggle");
const themeIcon = document.getElementById("theme-icon");
const themeText = document.getElementById("theme-text");

const moonIconClass = "fa-solid fa-moon";
const sunIconClass = "fa-solid fa-sun";

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")) {
        themeIcon.innerHTML = `<i class="${sunIconClass}"></i>`;
        themeText.textContent = "Light Mode";
        toggleBtn.style.background = "white";
        toggleBtn.style.color = "black";
    }
    else {
        themeIcon.innerHTML = `<i class="${moonIconClass}"></i>`;
        themeText.innerHTML = "Dark Mode";
        toggleBtn.style.background = "black";
        toggleBtn.style.color = "white";
    }

    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Function to update the weather background image based on icon code
const backgroundImage = document.getElementById("bgImage");
function updateWeatherBgImg(iconCode) {
    let backgroundUrl = '';
    const screenWidth = window.innerWidth;

    function getResponsiveImage(mobile, desktop) {
        if (screenWidth <= 480) return mobile;
        if (screenWidth <= 768) return mobile;
        if (screenWidth <= 1024) return mobile;
        return desktop;
    }

    switch(iconCode) {
        case '01d':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/Clearsky-Day.webp',
            'assets/largeDesktop/ClearSky-Day.webp'
            );
            break;
        case '01n':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/Clearsky-Night.webp',
            'assets/largeDesktop/ClearSky-Night.webp'
            );
            break;

        case '02d':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/fewClouds-Day.webp',
            'assets/largeDesktop/fewClouds-Day.webp'
            );
            break;
        case '02n':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/fewClouds-Night.webp',
            'assets/largeDesktop/fewClouds-Night.webp'
            );
            break;

        case '03d':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/scatteredClouds-Day.webp',
            'assets/largeDesktop/ScatteredClouds-Day.webp'
            );
            break;
        case '03n':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/scatteredClouds-Night.webp',
            'assets/largeDesktop/ScatteredClouds-Night.webp'
            );
            break;

        case '04d':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/brokenClouds-Day.webp',
            'assets/largeDesktop/BrokenClouds-Day.webp'
            );
            break;
        case '04n':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/brokenClouds-Night.webp',
            'assets/largeDesktop/BrokenClouds-Night.webp'
            );
            break;

        case '09d':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/showerrain-day.webp',
            'assets/largeDesktop/ShowerRain-Day.webp'
            );
            break;
        case '09n':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/showerRain-Night.webp',
            'assets/largeDesktop/ShowerRain-Night.webp'
            );
            break;

        case '10d':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/Rain-Day.webp',
            'assets/largeDesktop/RainDay.webp'
            );
            break;
        case '10n':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/Rain-Night.webp',
            'assets/largeDesktop/RainNight.webp'
            );
            break;

        case '11d':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/Thunderstorm-Day.webp',
            'assets/largeDesktop/ThunderstormDay.webp'
            );
            break;
        case '11n':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/Thundestorm_night.webp',
            'assets/largeDesktop/ThundestormNight.webp'
            );
            break;

        case '13d':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/Snow-Day.webp',
            'assets/largeDesktop/snowDay.webp'
            );
            break;
        case '13n':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/Snow-Night.webp',
            'assets/largeDesktop/SnowNight.webp'
            );
            break;

        case '50d':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/Mist-Day.webp',
            'assets/largeDesktop/MistDay.webp'
            );
            break;
        case '50n':
            backgroundUrl = getResponsiveImage(
            'assets/mobile/Mist-Night.webp',
            'assets/largeDesktop/MistNight.webp'
            );
            break;

        default:
            backgroundUrl = getResponsiveImage(
            'assets/mobBackImg.webp',
            'assets/NaturePic.webp'
            );
    }
    backgroundImage.style.backgroundImage = `url(${backgroundUrl})`;
}

// Load saved preferences and location data on window load
window.addEventListener("load", () => {
    const savedUnit = localStorage.getItem("tempUnit");
    if (savedUnit === "F") {
        tempToggle.checked = true;
    }
    updateCelsiusFahrenheitTemp();

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeIcon.innerHTML = `<i class="${sunIconClass}"></i>`;
        themeText.textContent = "Light Mode";
        toggleBtn.style.background = "white";
        toggleBtn.style.color = "black";
    }

    let savedData = null;
    try {
        savedData = JSON.parse(localStorage.getItem("locationData"));
    } catch (e) {
        console.error("Invalid localStorage data");
    }

    if (savedData) {
        locationName.textContent = savedData.value;
        locationName.style.display = "inline";

        if (savedData.type === "current") {
            getWeather(null, savedData.lat, savedData.lon);
        } else {
            getWeather(savedData.value);
        }
    } else {
        loadCurrentLocation();
    }
});

// Update hourly chart and background image on window resize
window.addEventListener('resize', () => {
    hourlyChart.options = getHourlyChartOptions();
    hourlyChart.update();

    if (currentIconCode) {
        updateWeatherBgImg(currentIconCode);
    }
});



