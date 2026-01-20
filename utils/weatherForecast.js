import { convertDateToDay } from "../utils/convertDate.js";
let hourlyForeCast = document.querySelector(".hourly-weather-data");
let dailyWeather = document.querySelector(".daily-weather-data");

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

export { getHourlyForecast, getWeeklyForecast };
