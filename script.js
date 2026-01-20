import debounceCity from "./utils/debounce.js";
import getWeatherData from "./services/getWeatherData.js";
import getCurrentLocationWeather from "./utils/getCurrentLocation.js";
import getCityName from "./services/getCityName.js";
let input = document.querySelector(".searchbar");
let searchButton = document.querySelector(".search-button");
let suggestions = document.querySelector(".dropdown-suggestions");
let locate = document.querySelector(".location");

//Location button event listener
locate.addEventListener("click", () => {
  getCurrentLocationWeather();
});

// Load weather data on window load
window.addEventListener("load", () => {
  const latitude = localStorage.getItem("latitude"),
    longitude = localStorage.getItem("longitude");

  // If coordinates are stored in localStorage, use them; otherwise, get current location weather
  latitude && longitude
    ? getWeatherData(latitude, longitude)
    : getCurrentLocationWeather();
});
// Input field event listeners
input.addEventListener("keydown", async (event) => {
  if ("Enter" === event.key) {
    let cityName = await getCityName(input.value);
    cityName &&
      (getWeatherData(cityName[0].lat, cityName[0].lon),
      (input.value = ""),
      (suggestions.innerHTML = ""),
      (suggestions.style.display = "none"));
  }
});

// Show suggestions on focus and hide on blur
input.addEventListener("focusin", () => {
  suggestions.style.display = "grid";
});
input.addEventListener("focusout", () => {
  setTimeout(() => {
    suggestions.style.display = "none";
  }, 200);
});

// Input event listener for debounced city suggestions
input.addEventListener("input", (event) => {
  ((suggestions.style.display = "grid"), debounceCity(event.target.value));
});

// Search button and suggestions click event listeners
searchButton.addEventListener("click", async () => {
  let cityName = await getCityName(input.value);
  cityName &&
    (getWeatherData(cityName[0].lat, cityName[0].lon),
    (input.value = ""),
    (suggestions.innerHTML = ""),
    (suggestions.style.display = "none"));
});

// Suggestions click event listener
suggestions.addEventListener("click", async (event) => {
  if (event.target.matches(".suggestions")) {
    let city = event.target.textContent.split(",")[0],
      cityName = await getCityName(city);
    cityName &&
      (getWeatherData(cityName[0]?.lat, cityName[0]?.lon),
      (input.value = ""),
      (suggestions.innerHTML = ""),
      (suggestions.style.display = "none"));
  }
});
