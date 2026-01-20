import displayError from "../utils/errorHandler.js";
import api from "./api.js";
import showWeather from "../utils/showWeather.js";
import {
  getHourlyForecast,
  getWeeklyForecast,
} from "../utils/weatherForecast.js";
let body = document.querySelector("body");

const getWeatherData = async (latitude, longitude) => {
  try {
    const response = await api.get(
      `/forecast.json?q=${latitude},${longitude}&days=5&aqi=yes`,
    );
    const data = response.data;
    console.log(data);
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
