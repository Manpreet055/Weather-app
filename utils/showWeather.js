let weatherCondition = document.querySelector(".current-weather-condition");
let cityName = document.querySelector(".city-name");
let temperature = document.querySelector(".temperature");
let airQualityElement = document.querySelector(".aqi-info");
let date = document.querySelector(".date");
let heat = document.querySelector("#heat-unit");
let humidity = document.querySelector(".humidity-unit");
let windSpeed = document.querySelector("#windspeed-unit");
let pressure = document.querySelector("#pressure-unit");
let feelsLike = document.querySelector("#feelslike-unit");
let visibility = document.querySelector("#visibility-unit");
let averageTemprature = document.querySelector("#avgTemp-unit");
let sunRise = document.querySelector(".sunRise");
let sunSet = document.querySelector(".sunSet");
let uv = document.querySelector(".uv-unit");
let aqiDescriptions = {
  1: "Good",
  2: "Fair",
  3: "Moderate",
  4: "Poor",
  5: "Very Poor",
};

function getUV(uvIndex) {
  if (uvIndex <= 2) return "Low";
  if (uvIndex <= 5) return "Moderate";
  if (uvIndex <= 7) return "High";
  if (uvIndex <= 10) return "Very High";
  return "Extreme";
}

function showWeather(data) {
  const currentWeatherData = data.current;
  const todayForecast = data.forecast.forecastday[0].day;

  cityName.textContent = `${data.location.name}`;
  date.textContent = convertDateToDay(data.forecast.forecastday[0].date);
  weatherCondition.textContent = currentWeatherData.condition.text;

  const temperatureCelsius = currentWeatherData.temp_c;
  temperature.textContent = temperatureCelsius.toFixed(0) + "°";

  const aqiIndex = data.current.air_quality["us-epa-index"];
  const aqiDescription = aqiDescriptions[aqiIndex];
  airQualityElement.textContent = `AQI ${aqiIndex}-${aqiDescription}`;

  feelsLike.textContent = currentWeatherData.feelslike_c + "°";
  humidity.textContent = currentWeatherData.humidity + "%";
  pressure.textContent = currentWeatherData.pressure_mb + " hPa";
  uv.textContent = `${currentWeatherData.uv} ${getUV(currentWeatherData.uv)}`;
  averageTemprature.textContent = todayForecast.avgtemp_c + "°";
  visibility.textContent = todayForecast.avgvis_km + " km";
  heat.textContent = currentWeatherData.heatindex_c + "°";
  windSpeed.textContent = currentWeatherData.wind_kph + "km/h";

  const astroData = data.forecast.forecastday[0].astro;
  sunRise.textContent = astroData.sunrise;
  sunSet.textContent = astroData.sunset;
}

export default showWeather;
