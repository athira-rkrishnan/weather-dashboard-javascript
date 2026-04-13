let currentTempData = null;

// Updating Time and date
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
}
searchIcon.addEventListener("click", displayLocationName);

searchInput.addEventListener("keydown", (event) => {
    if(event.key === "Enter") {
        displayLocationName();
    }
});




// Fetching Weather Data 
async function getWeather(locationName, lat, lon) {
    //console.log(value);
    const apiKey = "968b2abf92825ff2190a5cdbfd465552";
    let weatherapiURL;
    if(lat && lon) {
        weatherapiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    }
    else {
        weatherapiURL = `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${apiKey}&units=metric`;
    }
    console.log(weatherapiURL);
    const airQualityIndexURL= (lat, lon) => {
       return `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    };
    console.log(airQualityIndexURL);

    const currForecastAPIUrl = (lat, lon) => {
        return `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${apiKey}&units=metric`;
    };
    console.log(currForecastAPIUrl);
        
    try {
        const weatherResponse = await fetch(weatherapiURL);
        if(!weatherResponse.ok) {
            throw new Error("Failed to fetch weather data");
        }
        const weatherData = await weatherResponse.json();
        console.log(weatherData);

        const latitude = weatherData.coord?.lat;
        const longitude = weatherData.coord?.lon;
        console.log(latitude);
        console.log(longitude);

        const airQualityIndexResponse = fetch(airQualityIndexURL(latitude, longitude));
        const currForecastResponse = fetch(currForecastAPIUrl(latitude, longitude));
        const [airQltyIndexRes, currForecastRes] = await Promise.all([airQualityIndexResponse, currForecastResponse]);

        if(!airQltyIndexRes.ok || !currForecastRes.ok) {
            throw new Error("Failed to fetch additional data");
        }
        const airQltyIndexData = await airQltyIndexRes.json();
        const currForecastData = await currForecastRes.json();
        console.log(airQltyIndexData);
        console.log(currForecastData);

        const aqi = airQltyIndexData?.list?.[0]?.main?.aqi ?? "N/A";
        const {description, color} = getAirQltyIndexName(aqi);
        const components = airQltyIndexData?.list?.[0]?.components;
        console.log(aqi); 
        console.log(components);

        const weatherDescription = weatherData.weather?.[0]?.description ?? "N/A";
        const weatherIconCode = weatherData.weather?.[0]?.icon;
        const feelsLike = Math.round(weatherData.main?.feels_like);
        const temp = Math.round(weatherData.main?.temp);
        const highTemp = Math.round(weatherData.main?.temp_max);
        const lowTemp = Math.round(weatherData.main?.temp_min);
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
        console.log(daysForecasts);
        daysForecasts.forEach(day => {
            const date = new Date(day.dt * 1000);
            const options = {
                month: "short",
                day: "numeric"
            };
            const formattedDate = date.toLocaleDateString(undefined, options);

            const weather = day.weather[0];
            const iconCode = weather.icon;
            const mainText = weather.main;
            const tempDay = Math.round(day.temp.day);

        console.log(`Date: ${formattedDate}`);
        console.log(`Weather: ${mainText}`);
        console.log(`Icon: ${iconCode}`);
        console.log(`Temp: ${tempDay}°C`);

            const daysForecastDiv = document.createElement("div");
            daysForecastDiv.className = "days-lists";
            daysForecastDiv.innerHTML = `<img src = "${iconSrc}" style="width: 30px;">
                                         <span class="wname">${mainText}</span>
                                         <span class="nxt-temp">${tempDay}°C</span>
                                         <span>${formattedDate}</span>`;
            daysForecastContainer.appendChild(daysForecastDiv);
        });


        const hourlyForecasts = currForecastData.hourly.slice(0, 24);
        console.log(hourlyForecasts);
        updateHourlyChart(hourlyForecasts);

       
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
        document.getElementById("rain").textContent = rainText;

        document.getElementById("humidity").textContent = humidity === "N/A" ? "N/A" : `${humidity} %`;
        document.getElementById("visibility").textContent = visibilityKm === "N/A" ? "N/A" : `${visibilityKm} km`;
        document.getElementById("pressure").textContent = pressure === "N/A" ? "N/A" : `${pressure} mb`;
        document.getElementById("windSpeed").textContent = windspeedKm === "N/A" ? "N/A" : `${windspeedKm.toFixed(1)} km/h`;

        currentTempData = {
            temp,
            feelsLike,
            highTemp,
            lowTemp
        };

        updateCelsiusFahrenheitTemp();
    }
    catch(error) {
        console.error("Error fetching weather data:", error);
    }
}

 //getWeather();

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

// Celsius to Fahrenheit Conversion 
function convertToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
}

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
});


// Dark-Light Theme Toggle Button
const backgroundImage = document.getElementById("bgImage");
const toggleBtn = document.getElementById("darklightToggle");
const themeIcon = document.getElementById("theme-icon");
const themeText = document.getElementById("theme-text");

const moonIconClass = "fa-solid fa-moon";
const sunIconClass = "fa-solid fa-sun";

toggleBtn.addEventListener("click", () => {
    backgroundImage.classList.toggle("dark-mode");

    if(backgroundImage.classList.contains("dark-mode")) {
        themeIcon.innerHTML = `<i class="${sunIconClass}"></i>`;
        themeText.textContent = "Light Mode";
        toggleBtn.style.background = "white";
        toggleBtn.style.color = "black";
        backgroundImage.style.backgroundImage = "url('assets/blackBG.webp')";
    }
    else {
        themeIcon.innerHTML = `<i class="${moonIconClass}"></i>`;
        themeText.innerHTML = "Dark Mode";
        toggleBtn.style.background = "black";
        toggleBtn.style.color = "white";
        backgroundImage.style.backgroundImage = "url('assets/NaturePic1.webp')";
    }
});



const canvasEl = document.getElementById("hourChart");
const hourlyChart = new Chart(canvasEl, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Temperature (°C)',
        data: [],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  function updateHourlyChart(hourlyData) {
    const labels = hourlyData.map(hour => {
        const date = new Date(hour.dt * 1000);
        return date.toLocaleTimeString([], {hour: '2-digit'});
    });
    const hrTemp = hourlyData.map(hour => Math.round(hour.temp));
    hourlyChart.data.labels = labels;
    hourlyChart.data.datasets[0].data = hrTemp;
    hourlyChart.update();
  }

  
const currLocationBtn = document.querySelector('.curr-location');
currLocationBtn.addEventListener("click", () => {
    loadCurrentLocation();
});


async function loadCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
                const {latitude, longitude} = position.coords;
                try {
                   const apiKey = "968b2abf92825ff2190a5cdbfd465552";
                   const geoURL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
                   const res = await fetch(geoURL);
                   const data = await res.json(); 
                   console.log(data);

                   const cityName = data[0]?.name || "Mumbai";
                   document.getElementById("lctn-name").textContent = cityName;
                   getWeather(null, latitude, longitude);
                }
                catch (error) {
                    console.error("Error fetching location:", error);
                    alert("Unable to fetch location name.");
                }  
            }, (error) => {
                    console.error('Geolocation error:', error);
                    alert('Unable to retrieve your location.');
                }
        );
    } 
    else {
        alert('Geolocation is not supported by your browser.');
    }
}

window.addEventListener('load', () => {
    loadCurrentLocation();
});


function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

async function fetchCitySuggestions(query) {
     const suggestionBox = document.getElementById("suggestion-box");

    if (!query) {
       suggestionBox.innerHTML = '';
        return;
    }
    try {
        const apiKey = "968b2abf92825ff2190a5cdbfd465552";
        const geoCityFetchurl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
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


const debouncedSearch = debounce(fetchCitySuggestions, 300);
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    debouncedSearch(query);
});




    




