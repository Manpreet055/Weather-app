let longitude;
let latitude;

let primaryApiKey = "7272517a48db4727b09183643250205";
// const apiKey = "c1482848b4593d224d394f35ca73bdab";

let cityName = document.querySelector(".city-name");
let temperature = document.querySelector(".temperature");
let airQualityElement = document.querySelector(".aqi-info");
let date = document.querySelector(".date");
let hourlyForeCast = document.querySelector(".hourly-weather-data");
let body = document.querySelector("body");
let weatherCondition = document.querySelector(".current-weather-condition");
let aqiDescriptions = {
  1: "Good",
  2: "Fair",
  3: "Moderate",
  4: "Poor",
  5: "Very Poor",
};
let humidity = document.querySelector(".humidity-unit");
let sunRise = document.querySelector(".sunRise");
let sunSet = document.querySelector(".sunSet");
let windSpeed = document.querySelector("#windspeed-unit");
let pressure = document.querySelector("#pressure-unit");
let feelsLike = document.querySelector("#feelslike-unit");
let visibility = document.querySelector("#visibility-unit");
let averageTemprature = document.querySelector("#avgTemp-unit");
let uv = document.querySelector(".uv-unit");
let heat = document.querySelector("#heat-unit");

navigator.geolocation.getCurrentPosition(
  (position) => {
    // Success callback
    latitude = position.coords.latitude;
    cityName;
    longitude = position.coords.longitude;
    getWeatherData();
  },
  (error) => {
    // Error callback
    console.error("Error Code:", error.code, "-", error.message);
  }
);

//Get weather Data function
async function getWeatherData() {
  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${primaryApiKey}&q=${latitude},${longitude}&days=1&aqi=yes`
    );
    if (!response.ok) {
      throw new Error("Something went Wrong..");
    }
    let weatherData = await response.json();

    console.log(weatherData);

    if (weatherData.forecast.forecastday[0].astro.is_moon_up != 1) {
      body.classList.add("dayBackground");
    } else {
      body.classList.remove("dayBackground");
    }

    showWeather(weatherData);
    getHourlyForecast(weatherData);
  } catch (error) {
    console.error(error.message);
  }
}

function getUV(uvi) {
  if (uvi <= 2) return "Low";
  if (uvi <= 5) return "Moderate";
  if (uvi <= 7) return "High";
  if (uvi <= 10) return "Very High";
  if (uvi > 10) return "Extreme";
}

function showWeather(weatherData) {
  let currentData = weatherData.current;
  let currentDayData = weatherData.forecast.forecastday[0].day;

  //Basic info updation
  cityName.textContent = weatherData.location.region;
  date.textContent = weatherData.forecast.forecastday[0].date;
  weatherCondition.textContent = currentData.condition.text;

  let temp = currentData.temp_c;
  temperature.textContent = temp.toFixed(0) + "\u00B0";

  let airQuality = weatherData.current.air_quality["us-epa-index"];
  let displayAirQuality = aqiDescriptions[airQuality];
  airQualityElement.textContent =
    airQualityElement.textContent + " " + airQuality + "-" + displayAirQuality;

  feelsLike.textContent = currentData.feelslike_c + "\u00B0";
  humidity.textContent = currentData.humidity + "%";
  pressure.textContent = currentData.pressure_mb + " " + "hPa";
  uv.textContent = currentData.uv + " " + getUV(currentData.uv);
  averageTemprature.textContent = currentDayData.avgtemp_c + "\u00B0";
  visibility.textContent = currentDayData.avgvis_km + " " + "km";
  heat.textContent = weatherData.current.heatindex_c + "\u00B0";
  windSpeed.textContent = currentData.wind_kph + "km/h";

  let astro = weatherData.forecast.forecastday[0].astro;
  sunRise.textContent = astro.sunrise;
  sunSet.textContent = astro.sunset;
}

//function of get hourlyData and update that data on DOM
function getHourlyForecast(weatherData) {
  let hourlyData = weatherData.forecast.forecastday[0].hour;
  hourlyData.forEach((data) => {
    hourlyForeCast.insertAdjacentHTML(
      "beforeend",
      `<span class = hourlyTime>${data.time.slice(11)}</span><img src="${
        data.condition.icon
      }" alt="weatherIcon" class="hourlyWeatherIcon" ><span class="hourlyTemp">${
        data.temp_c + "\u00B0"
      }</span>`
    );
  });
}
