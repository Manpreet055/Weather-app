import getCurrentLocationWeather from "./utils/getCurrentLocation.js";
import getWeatherData from "./services/getWeatherData.js";
import getCityName from "./services/getCityName.js";
import debounceCity from "./utils/debounce.js";
let input = document.querySelector(".searchbar");
let searchButton = document.querySelector(".search-button");
let suggestions = document.querySelector(".dropdown-suggestions");
let locate = document.querySelector(".location");

(locate.addEventListener("click", () => {
  getCurrentLocationWeather();
}),
  window.addEventListener("load", () => {
    const latitude = localStorage.getItem("latitude"),
      longitude = localStorage.getItem("longitude");
    latitude && longitude
      ? getWeatherData(latitude, longitude)
      : getCurrentLocationWeather();
  }),
  input.addEventListener("keydown", async (event) => {
    if ("Enter" === event.key) {
      let cityName = await getCityName(input.value);
      cityName &&
        (getWeatherData(cityName[0].lat, cityName[0].lon),
        (input.value = ""),
        (suggestions.innerHTML = ""),
        (suggestions.style.display = "none"));
    }
  }),
  input.addEventListener("focusin", () => {
    suggestions.style.display = "grid";
  }),
  input.addEventListener("focusout", () => {
    setTimeout(() => {
      suggestions.style.display = "none";
    }, 200);
  }));

(input.addEventListener("input", (event) => {
  ((suggestions.style.display = "grid"), debounceCity(event.target.value));
}),
  searchButton.addEventListener("click", async () => {
    let cityName = await getCityName(input.value);
    cityName &&
      (getWeatherData(cityName[0].lat, cityName[0].lon),
      (input.value = ""),
      (suggestions.innerHTML = ""),
      (suggestions.style.display = "none"));
  }),
  suggestions.addEventListener("click", async (event) => {
    if (event.target.matches(".suggestions")) {
      let city = event.target.textContent.split(",")[0],
        cityName = await getCityName(city);
      cityName &&
        (getWeatherData(cityName[0].lat, cityName[0].lon),
        (input.value = ""),
        (suggestions.innerHTML = ""),
        (suggestions.style.display = "none"));
    }
  }));
