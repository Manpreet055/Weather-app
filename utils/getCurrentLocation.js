import getWeatherData from "../services/getWeatherData.js";
import displayError from "./errorHandler.js";

async function getCurrentLocationWeather() {
  try {
    const position = await new Promise((e, t) => {
      navigator.geolocation.getCurrentPosition(e, t);
    });
    let latitude = position.coords.latitude,
      longitude = position.coords.longitude;
    await getWeatherData(latitude, longitude);
  } catch (e) {
    displayError(e.message);
  }
}

export default getCurrentLocationWeather;
