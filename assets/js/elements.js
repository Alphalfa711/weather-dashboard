let searchedCity;
let searchedState;
let searchedCountry;

const searchText = document.getElementById('searchText');
const searchBtn = document.getElementById('searchBtn');

// Local storage
let favoritesArray = JSON.parse(localStorage.getItem("favorites"));


// Current weather elements
const currentCity = document.getElementById('current-city');
const currentState = document.getElementById('current-state');
const currentCountry = document.getElementById('current-country');
const currentDesc = document.getElementById('current-description');
const currentHigh = document.getElementById('current-high');
const currentLow = document.getElementById('current-low');
const currentWeatherIcon = document.getElementById('current-weather-icon');
const currentTemp = document.getElementById('current-temp');
const currentFeelsLike = document.getElementById('current-feels-like');
const currentHumidity = document.getElementById('current-humidity'); 
const currentPressure = document.getElementById('current-pressure');

// Favorites elements
const favoritesContainer = document.getElementById('favorites-container');
const favoritesList = document.getElementById('favorites-list')