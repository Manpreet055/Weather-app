let longitude;
let latitude;

let input = document.querySelector(".searchbar");
let searchButton = document.querySelector(".search-button");
let cityName = document.querySelector(".city-name");
let temperature = document.querySelector(".temperature");
let airQualityElement = document.querySelector(".aqi-info");
let date = document.querySelector(".date");
let hourlyForeCast = document.querySelector(".hourly-weather-data");
let body = document.querySelector("body");
let weatherCondition = document.querySelector(".current-weather-condition");
let dailyWeather = document.querySelector(".daily-weather-data");
let aqiDescriptions = {
  1: "Good",
  2: "Fair",
  3: "Moderate",
  4: "Poor",
  5: "Very Poor",
};
let errorCardWrapper = document.querySelector(".error-card-wrapper");
let suggestions = document.querySelector(".dropdown-suggestions");
let errorCard = document.querySelector(".error-card");
let locate = document.querySelector(".location");
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
locate.addEventListener("click", () => {
  getCurrentLocationWeather();
});

async function getCurrentLocationWeather() {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    await getWeatherData(latitude, longitude);
  } catch (error) {
    displayError(error.message);
  }
}
window.addEventListener("load", () => {
  const savedLat = localStorage.getItem("latitude");
  const savedLon = localStorage.getItem("longitude");

  if (savedLat && savedLon) {
    getWeatherData(savedLat, savedLon);
  } else {
    getCurrentLocationWeather(); // Fallback to current location
  }
});
//Get weather Data function
async function getWeatherData(latitude, longitude) {
  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=7272517a48db4727b09183643250205&q=${latitude},${longitude}&days=5&aqi=yes`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Weather Data..");
    }
    let weatherData = await response.json();
    if (weatherData.forecast.forecastday[0].astro.is_moon_up != 1) {
      body.classList.add("dayBackground");
    } else {
      body.classList.remove("dayBackground");
    }
    getWeeklyForecast(weatherData);
    showWeather(weatherData);
    if (cityName.textContent.trim().length > 7) {
      cityName.style.fontSize = "4rem";
    }
    getHourlyForecast(weatherData);
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message.toLowerCase === "failed to fetch"
    ) {
      displayError("Unable to connect,please check you internet connnection..");
    } else {
      displayError(error.message);
    }
  }
}

function getUV(uvi) {
  if (uvi <= 2) return "Low";
  if (uvi <= 5) return "Moderate";
  if (uvi <= 7) return "High";
  if (uvi <= 10) return "Very High";
  if (uvi > 10) return "Extreme";
}

function convertDateToDay(date) {
  let inputDate = new Date(date);
  let day = inputDate.toLocaleDateString("en-us", { weekday: "long" });
  return day;
}
function showWeather(weatherData) {
  let currentData = weatherData.current;
  let currentDayData = weatherData.forecast.forecastday[0].day;

  cityName.textContent = `${weatherData.location.name}`;

  date.textContent = convertDateToDay(weatherData.forecast.forecastday[0].date);
  weatherCondition.textContent = currentData.condition.text;

  let temp = currentData.temp_c;
  temperature.textContent = temp.toFixed(0) + "\u00B0";

  let airQuality = weatherData.current.air_quality["us-epa-index"];
  let displayAirQuality = aqiDescriptions[airQuality];
  airQualityElement.textContent =
    "AQI" + " " + airQuality + "-" + displayAirQuality;

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
  hourlyForeCast.innerHTML = "";
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

async function getCityName(city) {
  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=7272517a48db4727b09183643250205&q=${city}`
    );
    if (!response.ok) {
      throw new Error("Something went wrong..");
    }
    let searchedCity = await response.json();
    if (searchedCity.length === 0) {
      suggestions.innerHTML = "";
      throw new Error("City not found..");
    }

    localStorage.setItem("latitude", searchedCity[0].lat);
    localStorage.setItem("longitude", searchedCity[0].lon);
    console.log(searchedCity);

    // Clear previous suggestions
    suggestions.innerHTML = "";

    let fragment = document.createDocumentFragment();
    searchedCity.forEach((city) => {
      let span = document.createElement("span");
      span.className = "suggestions";
      span.textContent = city.name + ", " + city.region + ", " + city.country; // Corrected to city.name
      fragment.appendChild(span);
    });

    suggestions.appendChild(fragment);
    return searchedCity;
  } catch (error) {
    console.error(error.message);
    if (
      error instanceof TypeError &&
      error.message.toLowerCase === "failed to fetch"
    ) {
      displayError("Unable to connect,please check you internet connnection..");
    } else {
      console.error(error.message);
      return null;
    }
  }
}

input.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    let searchedCity = await getCityName(input.value);
    if (searchedCity) {
      getWeatherData(searchedCity[0].lat, searchedCity[0].lon);
      input.value = "";
      suggestions.innerHTML = "";
      suggestions.style.display = "none";
    }
  }
});

input.addEventListener("focusin", () => {
  suggestions.style.display = "grid";
});
input.addEventListener("focusout", () => {
  setTimeout(() => {
    suggestions.style.display = "none";
  }, 200);
});

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}
let debounceCity = debounce(async (value) => {
  await getCityName(value);
}, 500);
input.addEventListener("input", (event) => {
  suggestions.style.display = "grid";
  debounceCity(event.target.value);
});

searchButton.addEventListener("click", async () => {
  let searchedCity = await getCityName(input.value);
  if (searchedCity) {
    getWeatherData(searchedCity[0].lat, searchedCity[0].lon);
    input.value = "";
    suggestions.innerHTML = "";
    suggestions.style.display = "none";
  }
});
function getWeeklyForecast(dailyData) {
  let fragment = document.createDocumentFragment();
  let WeeklyData = dailyData.forecast.forecastday;

  // Clear previous content to avoid layout issues
  dailyWeather.innerHTML = "";

  WeeklyData.forEach((day) => {
    let date = document.createElement("span");
    date.className = "day";
    date.textContent = convertDateToDay(day.date);
    fragment.appendChild(date);

    let icon = document.createElement("img");
    let iconSource = day.day.condition.icon;
    icon.src = iconSource;
    fragment.appendChild(icon);

    let temp = document.createElement("span");
    temp.className = "daily-temp";
    let fetchTemp = day.day.avgtemp_c;
    temp.textContent = fetchTemp + "\u00B0";
    fragment.appendChild(temp);
  });

  dailyWeather.appendChild(fragment);
}

function displayError(errorMessage) {
  errorCardWrapper.style.display = "flex";
  errorCard.textContent = errorMessage;
  setTimeout(() => {
    errorCardWrapper.style.display = "none";
  }, 3000);
}

suggestions.addEventListener("click", async (event) => {
  if (event.target.matches(".suggestions")) {
    let clickedCity = event.target.textContent.split(",")[0]; // Extract city name
    let searchedCity = await getCityName(clickedCity);
    if (searchedCity) {
      getWeatherData(searchedCity[0].lat, searchedCity[0].lon);
      input.value = "";
      suggestions.innerHTML = "";
    }
  }
});
suggestions.addEventListener("mousedown", () => {
  suggestions.style.display = "grid";
});

