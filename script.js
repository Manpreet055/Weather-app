//This object contains all the elements of functionality of the website...
let functionality = {
  input: document.querySelector(".searchbar"),
  searchButton: document.querySelector(".search-button"),
  body: document.querySelector("body"),
  errorCardWrapper: document.querySelector(".error-card-wrapper"),
  suggestions: document.querySelector(".dropdown-suggestions"),
  errorCard: document.querySelector(".error-card"),
  locate: document.querySelector(".location")
};

//This is the object which holds the all information of weather
let ui = {
  hourlyForeCast: document.querySelector(".hourly-weather-data"),
  weatherCondition: document.querySelector(".current-weather-condition"),
  dailyWeather: document.querySelector(".daily-weather-data"),
  cityName: document.querySelector(".city-name"),
  temperature: document.querySelector(".temperature"),
  airQualityElement: document.querySelector(".aqi-info"),
  date: document.querySelector(".date"),
  heat: document.querySelector("#heat-unit"),
  humidity: document.querySelector(".humidity-unit"),
  windSpeed: document.querySelector("#windspeed-unit"),
  pressure: document.querySelector("#pressure-unit"),
  feelsLike: document.querySelector("#feelslike-unit"),
  visibility: document.querySelector("#visibility-unit"),
  averageTemprature: document.querySelector("#avgTemp-unit"),
  sunRise: document.querySelector(".sunRise"),
  sunSet: document.querySelector(".sunSet"),
  uv: document.querySelector(".uv-unit"),
  aqiDescriptions: {
    1: "Good",
    2: "Fair",
    3: "Moderate",
    4: "Poor",
    5: "Very Poor",
  }
};

//Get current location weather using click on ocation button
functionality.locate.addEventListener("click", () => {
  getCurrentLocationWeather();
});

//Get live location Function
let longitude;
let latitude;
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

//Retriving cityname from localstorage
window.addEventListener("load", () => {
  const savedLat = localStorage.getItem("latitude");
  const savedLon = localStorage.getItem("longitude");

  if (savedLat && savedLon) {
    getWeatherData(savedLat, savedLon);
  } else {
    getCurrentLocationWeather(); // Fallback to current location
  }
});

//Get weather Data function,This function includes api call
async function getWeatherData(latitude, longitude) {
  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=7272517a48db4727b09183643250205&q=${latitude},${longitude}&days=5&aqi=yes`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Weather Data..");
    }
    let weatherData = await response.json();
    if (weatherData.forecast.forecastday[0].astro.is_moon_up === 1) {
      functionality.body.classList.toggle(".night-background");
    }

    //Calling all the function inside get weather function
    getWeeklyForecast(weatherData);
    showWeather(weatherData);
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

//This is the function to dynamically update the un index 
function getUV(uvi) {
  if (uvi <= 2) return "Low";
  if (uvi <= 5) return "Moderate";
  if (uvi <= 7) return "High";
  if (uvi <= 10) return "Very High";
  if (uvi > 10) return "Extreme";
}

//This is the function to 
function convertDateToDay(date) {
  let inputDate = new Date(date);
  let day = inputDate.toLocaleDateString("en-us", { weekday: "long" });
  return day;
}
function showWeather(weatherData) {
  let currentData = weatherData.current;
  let currentDayData = weatherData.forecast.forecastday[0].day;

  ui.cityName.textContent = `${weatherData.location.name}`;

  ui.date.textContent = convertDateToDay(
    weatherData.forecast.forecastday[0].date
  );
  ui.weatherCondition.textContent = currentData.condition.text;

  let temp = currentData.temp_c;
  ui.temperature.textContent = temp.toFixed(0) + "\u00B0";

  let airQuality = weatherData.current.air_quality["us-epa-index"];
  let displayAirQuality = ui.aqiDescriptions[airQuality];
  ui.airQualityElement.textContent =
    "AQI" + " " + airQuality + "-" + displayAirQuality;

  ui.feelsLike.textContent = currentData.feelslike_c + "\u00B0";
  ui.humidity.textContent = currentData.humidity + "%";
  ui.pressure.textContent = currentData.pressure_mb + " " + "hPa";
  ui.uv.textContent = currentData.uv + " " + getUV(currentData.uv);
  ui.averageTemprature.textContent = currentDayData.avgtemp_c + "\u00B0";
  ui.visibility.textContent = currentDayData.avgvis_km + " " + "km";
  ui.heat.textContent = weatherData.current.heatindex_c + "\u00B0";
  ui.windSpeed.textContent = currentData.wind_kph + "km/h";

  let astro = weatherData.forecast.forecastday[0].astro;
  ui.sunRise.textContent = astro.sunrise;
  ui.sunSet.textContent = astro.sunset;
}
//function of get hourlyData and update that data on DOM
function getHourlyForecast(weatherData) {
  let hourlyData = weatherData.forecast.forecastday[0].hour;
  ui.hourlyForeCast.innerHTML = "";
  hourlyData.forEach((data) => {
    ui.hourlyForeCast.insertAdjacentHTML(
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
      functionality.suggestions.innerHTML = "";
      functionality.suggestions.textContent = "City not found";
      throw new Error("City not found..");
    }

    localStorage.setItem("latitude", searchedCity[0].lat);
    localStorage.setItem("longitude", searchedCity[0].lon);
    console.log(searchedCity);

    // Clear previous suggestions
    functionality.suggestions.innerHTML = "";

    let fragment = document.createDocumentFragment();
    searchedCity.forEach((city) => {
      let span = document.createElement("span");
      span.className = "suggestions";
      span.textContent = city.name + ", " + city.region + ", " + city.country; // Corrected to city.name
      fragment.appendChild(span);
    });

    functionality.suggestions.appendChild(fragment);
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

functionality.input.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    let searchedCity = await getCityName(functionality.input.value);
    if (searchedCity) {
      getWeatherData(searchedCity[0].lat, searchedCity[0].lon);
      functionality.input.value = "";
      functionality.suggestions.innerHTML = "";
      functionality.suggestions.style.display = "none";
    }
  }
});

functionality.input.addEventListener("focusin", () => {
  functionality.suggestions.style.display = "grid";
});
functionality.input.addEventListener("focusout", () => {
  setTimeout(() => {
    functionality.suggestions.style.display = "none";
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
functionality.input.addEventListener("input", (event) => {
  functionality.suggestions.style.display = "grid";
  debounceCity(event.target.value);
});

functionality.searchButton.addEventListener("click", async () => {
  let searchedCity = await getCityName(functionality.input.value);
  if (searchedCity) {
    getWeatherData(searchedCity[0].lat, searchedCity[0].lon);
    functionality.input.value = "";
    functionality.suggestions.innerHTML = "";
    functionality.suggestions.style.display = "none";
  }
});
function getWeeklyForecast(dailyData) {
  let fragment = document.createDocumentFragment();
  let WeeklyData = dailyData.forecast.forecastday;

  // Clear previous content to avoid layout issues
  ui.dailyWeather.innerHTML = "";

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

  ui.dailyWeather.appendChild(fragment);
}

function displayError(errorMessage) {
  functionality.errorCardWrapper.style.display = "flex";
  functionality.errorCard.textContent = errorMessage;
  setTimeout(() => {
    functionality.errorCardWrapper.style.display = "none";
  }, 3000);
}

functionality.suggestions.addEventListener("click", async (event) => {
  if (event.target.matches(".suggestions")) {
    let clickedCity = event.target.textContent.split(",")[0]; // Extract city name
    let searchedCity = await getCityName(clickedCity);
    if (searchedCity) {
      getWeatherData(searchedCity[0].lat, searchedCity[0].lon);
      functionality.input.value = "";
      functionality.suggestions.innerHTML = "";
    }
  }
});
functionality.suggestions.addEventListener("mousedown", () => {
  functionality.suggestions.style.display = "grid";
});
