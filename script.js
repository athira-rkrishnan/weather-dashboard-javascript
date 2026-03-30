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
    searchInput.value = "";  
}
searchIcon.addEventListener("click", displayLocationName);

searchInput.addEventListener("keydown", (event) => {
    if(event.key === "Enter") {
        displayLocationName();
    }
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

