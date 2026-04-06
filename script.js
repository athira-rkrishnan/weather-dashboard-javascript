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
async function getWeather(locationName) {
    //console.log(value);
    const apiKey = "968b2abf92825ff2190a5cdbfd465552";
    const weatherapiURL = `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${apiKey}&units=metric`;
    const airQualityIndexURL= (lat, lon) => {
       return `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    };
    console.log(airQualityIndexURL);
    
    try {
        const weatherResponse = await fetch(weatherapiURL);
        if(!weatherResponse.ok) {
            throw new Error("Failed to fetch weather data");
        }
        const weatherData = await weatherResponse.json();
        
        
        console.log(weatherData);

        const latitude = weatherData.coord.lat;
        const longitude = weatherData.coord.lon;

        console.log(latitude);
        console.log(longitude);

        const airQualityIndexResponse = fetch(airQualityIndexURL(latitude, longitude));
        const [airQltyIndexRes, _] = await Promise.all([airQualityIndexResponse, Promise.resolve()]);

        if(!airQltyIndexRes.ok) {
            throw new Error("Failed to fetch air pollution data");
        }
        const airQltyIndexData = await airQltyIndexRes.json();
        console.log(airQltyIndexData);

        const aqi = airQltyIndexData.list[0].main.aqi;
        const components = airQltyIndexData.list[0].components;
        console.log(aqi); 
        console.log(components);

        document.getElementById("aqiValue").textContent = `${aqi}`;
        document.getElementById("pm2.5Value").textContent = `${components.pm2_5} μg/m3`;
        document.getElementById("pm10Value").textContent = `${components.pm10} μg/m3`;
        document.getElementById("so2Value").textContent = `${components.so2} μg/m3`;
        document.getElementById("no2Value").textContent = `${components.no2} μg/m3`;
        document.getElementById("O3Value").textContent = `${components.o3} μg/m3`;
        document.getElementById("COValue").textContent = `${components.co} μg/m3`;

        const weatherDescription = weatherData.weather[0].description;
        const weatherIconCode = weatherData.weather[0].icon;
        const feelsLike = Math.round(weatherData.main.feels_like);
        const temp = Math.round(weatherData.main.temp);
        const highTemp = Math.round(weatherData.main.temp_max);
        const lowTemp = Math.round(weatherData.main.temp_min);
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

        const sunriseUnix = weatherData.sys.sunrise;
        const sunsetUnix = weatherData.sys.sunset;
        const dayLengthSec = weatherData.sys.sunset - weatherData.sys.sunrise;
        const sunriseMillisec = new Date(sunriseUnix * 1000);
        const sunsetMillisec = new Date(sunsetUnix * 1000);
        const hours = Math.floor(dayLengthSec / 3600);
        const minutes = Math.floor((dayLengthSec % 3600) / 60);
        const formattedSunriseTime = sunriseMillisec.toLocaleTimeString(undefined, {
            hour: '2-digit', 
            minute: '2-digit',
        });
        const formattedSunsetTime = sunsetMillisec.toLocaleTimeString(undefined, {
            hour: '2-digit', 
            minute: '2-digit',
        });
       
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

        document.getElementById("riseTime").textContent = formattedSunriseTime;
        document.getElementById("setTime").textContent = formattedSunsetTime;
        document.getElementById("dayLength").textContent = `${hours}h ${minutes}min`;

        document.getElementById("humidity").textContent = humidity === "N/A" ? "N/A" : `${humidity} %`;
        document.getElementById("visibility").textContent = visibilityKm === "N/A" ? "N/A" : `${visibilityKm} km`;
        document.getElementById("pressure").textContent = pressure === "N/A" ? "N/A" : `${pressure} mb`;
        document.getElementById("windSpeed").textContent = windspeedKm === "N/A" ? "N/A" : `${windspeedKm.toFixed(1)} km/h`;

    }
    catch(error) {
        console.error("Error fetching weather data:", error);
    }
}


 //getWeather();


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

