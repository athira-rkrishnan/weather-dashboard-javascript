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
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=6a524c9afeac3b039318a2ede31c3cc6&units=metric`;
    try {
        const response = await fetch(apiURL);
        if(!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        const weatherDescription = data.weather[0].description;
        const weatherIconCode = data.weather[0].icon;
        const feelsLike = Math.round(data.main.feels_like);
        const temp = Math.round(data.main.temp);
        const highTemp = Math.round(data.main.temp_max);
        const lowTemp = Math.round(data.main.temp_min);

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



        document.querySelector(".weatherImg").src = iconSrc;
        document.querySelector(".weather-name").textContent = weatherDescription.charAt(0).toUpperCase() + 
        weatherDescription.slice(1);
        document.querySelector(".feels-like").textContent = `Feels like ${feelsLike}°C`;
        document.querySelector(".temp-value").textContent = `${temp}°C`;
        document.querySelector(".high").textContent = `High: ${highTemp}`;
        document.querySelector(".low").textContent = `Low: ${lowTemp}`;
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

