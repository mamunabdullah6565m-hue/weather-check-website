const apiKey = "060522195a227b1372623d5015fc4d8c";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherDisplay = document.getElementById("weatherDisplay");
const appContainer = document.getElementById("appContainer");
const errorDiv = document.getElementById("error");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const condition = document.getElementById("condition");
const dateTime = document.getElementById("dateTime");
const prevTemp = document.getElementById("prevTemp");
const nextTemp = document.getElementById("nextTemp");

searchBtn.addEventListener("click", () => getWeather(cityInput.value.trim()));
cityInput.addEventListener("keypress", e => {
  if (e.key === "Enter") getWeather(cityInput.value.trim());
});

async function getWeather(city) {
  if (!city) {
    showError("Please enter a city name!");
    return;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found!");

    const data = await response.json();
    displayWeather(data);
    getForecast(city);
  } catch (err) {
    showError(err.message);
  }
}

function displayWeather(data) {
  const { name } = data;
  const { temp, humidity } = data.main;
  const { speed } = data.wind;
  const { main } = data.weather[0];

  cityName.textContent = name;
  temperature.textContent = `${Math.round(temp)}°C`;
  humidity.textContent = humidity;
  windSpeed.textContent = speed;
  condition.textContent = main;

  const now = new Date();
  dateTime.textContent = now.toLocaleString();

  weatherDisplay.classList.remove("hidden");
  changeBackground(main);
}

function showError(message) {
  errorDiv.textContent = message;
  weatherDisplay.classList.add("hidden");
}

function changeBackground(condition) {
  appContainer.className = "app-container";
  const weather = condition.toLowerCase();

  if (weather.includes("rain")) appContainer.classList.add("rainy");
  else if (weather.includes("snow") || weather.includes("cold")) appContainer.classList.add("winter");
  else if (weather.includes("clear") || weather.includes("sun")) appContainer.classList.add("sunny");
  else appContainer.classList.add("cloudy");
}

async function getForecast(city) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const res = await fetch(forecastUrl);
  const data = await res.json();

  // Previous day = index 0, Next day = index 8 (24 hours later)
  const prevDayTemp = data.list[0].main.temp;
  const nextDayTemp = data.list[8].main.temp;

  prevTemp.textContent = `${Math.round(prevDayTemp)}°C`;
  nextTemp.textContent = `${Math.round(nextDayTemp)}°C`;
}
