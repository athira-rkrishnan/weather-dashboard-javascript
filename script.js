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

