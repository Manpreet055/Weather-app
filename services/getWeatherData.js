import displayError from "../utils/errorHandler.js";
import api from "../utils/api.js";
import showWeather from "../utils/showWeather.js";
let body = document.querySelector("body");
let hourlyForeCast = document.querySelector(".hourly-weather-data");
let dailyWeather = document.querySelector(".daily-weather-data");

// Function to convert date string to day of the week
function convertDateToDay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

function getHourlyForecast(data) {
  const hourlyData = data.forecast.forecastday[0].hour;
  hourlyForeCast.innerHTML = ""; // Clear previous forecast

  hourlyData.forEach((hour) => {
    hourlyForeCast.insertAdjacentHTML(
      "beforeend",
      `<span class = hourlyTime>${hour.time.slice(11)}</span>
       <img src="${hour.condition.icon}" alt="weatherIcon" class="hourlyWeatherIcon">
       <span class="hourlyTemp">${hour.temp_c}°</span>`,
    );
  });
}

function getWeeklyForecast(data) {
  const documentFragment = document.createDocumentFragment();
  const weeklyForecastData = data.forecast.forecastday;
  dailyWeather.innerHTML = ""; // Clear previous forecast

  weeklyForecastData.forEach((dayData) => {
    const dayElement = document.createElement("span");
    dayElement.className = "day";
    dayElement.textContent = convertDateToDay(dayData.date);
    documentFragment.appendChild(dayElement);

    const iconElement = document.createElement("img");
    const iconUrl = dayData.day.condition.icon;
    iconElement.src = iconUrl;
    documentFragment.appendChild(iconElement);

    const tempElement = document.createElement("span");
    tempElement.className = "daily-temp";
    const averageTemp = dayData.day.avgtemp_c;
    tempElement.textContent = `${averageTemp}°`;
    documentFragment.appendChild(tempElement);
  });

  dailyWeather.appendChild(documentFragment);
}

const getWeatherData = async (latitude, longitude) => {
  try {
    const response = await api.get(
      `/forecast.json?q=${latitude},${longitude}&days=5&aqi=yes`,
    );
    const data = response.data;

    if (data.forecast.forecastday[0].astro.is_sun_up !== 1) {
      body.classList.add("night");
    } else {
      body.classList.remove("night");
    }

    getWeeklyForecast(data);
    showWeather(data);
    getHourlyForecast(data);
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      displayError(
        "Unable to connect, please check your internet connection..",
      );
    } else {
      displayError(error.message);
    }
  }
};

export default getWeatherData;
