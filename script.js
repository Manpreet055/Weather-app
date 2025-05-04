let longitude;
let latitude;

let primaryApiKey = "7272517a48db4727b09183643250205";
const apiKey = "c1482848b4593d224d394f35ca73bdab";

//Elements
let cityName = document.querySelector(".cityName");
let weatherCondition = document.querySelector(".condition");
let humidity = document.querySelector(".humidity-unit");
let sunRise = document.querySelector(".sunRise");
let sunSet = document.querySelector(".sunSet");
let windSpeed = document.querySelector("#windSpeed");
let temperature = document.querySelector(".temperature");
let pressure = document.querySelector("#pressure__unit");
let feelsLike = document.querySelector("#feelslike__unit");
let visibility = document.querySelector("#visibility__unit");
let averageTemprature = document.querySelector("#avgTemp__unit");
let airQualityelement = document.querySelector(".aqi");
let uv = document.querySelector(".uv-unit");
let date = document.querySelector(".date");
let hourlyForeCast = document.querySelector(".hourlyForeCast");
let body = document.querySelector("body");
let heat = document.querySelector("#heat__unit");
let aqiMeaning = {
  1: "Good",
  2: "Fair",
  3: "Moderate",
  4: "Poor",
  5: "Very Poor",
};

navigator.geolocation.getCurrentPosition(
  (position) => {
    // Success callback
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        let airQuality = data.list[0].main.aqi;
        let displayAirQuality = aqiMeaning[airQuality];
        airQualityelement.textContent =
          airQualityelement.textContent +
          " " +
          airQuality +
          "-" +
          displayAirQuality;
      })
      .catch((error) => console.error(error.message));
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
      `https://api.weatherapi.com/v1/forecast.json?key=${primaryApiKey}&q=${latitude},${longitude}&days=1`
    );
    if (!response.ok) {
      throw new Error("Something went Wrong..");
    }
    let weatherData = await response.json();
    console.log(weatherData);
    showWeather(weatherData);
  } catch (error) {
    console.error(error.message);
  }
}

//Uv

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
  let astro = weatherData.forecast.forecastday[0].astro;
  cityName.textContent = weatherData.location.region;
  let temp = currentData.temp_c;
  temperature.textContent = temp.toFixed(0) + "\u00B0";
  feelsLike.textContent = currentData.feelslike_c + "\u00B0";
  humidity.textContent = currentData.humidity + "%";
  pressure.textContent = currentData.pressure_mb + " " + "hPa";
  uv.textContent = currentData.uv + " " + getUV(currentData.uv);
  windSpeed.textContent = currentData.wind_kph + "km/h";
  weatherCondition.textContent = currentData.condition.text;
  sunRise.textContent = astro.sunrise;
  sunSet.textContent = astro.sunset;
  averageTemprature.textContent = currentDayData.avgtemp_c + "\u00B0";
  visibility.textContent = currentDayData.avgvis_km + " " + "km";
  date.textContent = weatherData.forecast.forecastday[0].date;
  heat.textContent = weatherData.current.heatindex_c+"\u00B0";
  if (weatherData.forecast.forecastday[0].astro.is_moon_up == 1) {
    body.classList.toggle("dayBackground");
  }
  let hourlyData = weatherData.forecast.forecastday[0].hour;

  hourlyData.forEach((data) => {
    hourlyForeCast.insertAdjacentHTML(
      "beforeend",
      `<div class = hourlyTime>${data.time.slice(11)}</div><img src="${
        data.condition.icon
      }" alt="weatherIcon" class="hourlyWeatherIcon" ><div class="hourlyTemp">${
        data.temp_c + "\u00B0"
      }</div>`
    );
  });
}
// }

// async function getForecastData() {
//   try {
//     let response = await fetch(
//       `https://api.openweathermap.org/data/2.5/forecast?q=Dubai&appid=${apiKey}`
//     );
//     if (!response.ok) {
//       throw "Something Went Wrong...";
//     }
//     let data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error(error.message);
//   }
// }
