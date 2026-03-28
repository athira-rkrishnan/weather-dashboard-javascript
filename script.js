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
searchIcon.addEventListener("click", () => {
    locationName.textContent = searchInput.value;
    locationElement.style.display = "inline-block";
    locationElement.style.width = "auto";
    lctnIcon.style.marginRight = "0.1rem";    
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

