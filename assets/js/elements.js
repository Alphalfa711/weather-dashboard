let favoriteLocation = JSON.parse(localStorage.getItem('favoriteLocation'));

let searchedCity;
let searchedState;
let searchedCountry;

const searchText = document.getElementById('searchText');
const searchBtn = document.getElementById('searchBtn');

// Local storage
let searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory"));


// Current weather elements
const fetchDate = document.getElementById('fetch-date');
const fetchTime = document.getElementById('fetch-time');
const currentCity = document.getElementById('current-city');
const currentDesc = document.getElementById('current-description');
const currentHigh = document.getElementById('current-high');
const currentLow = document.getElementById('current-low');
const currentWeatherIcon = document.getElementById('current-weather-icon');
const currentTemp = document.getElementById('current-temp');
const currentFeelsLike = document.getElementById('current-feels-like');
const currentHumidity = document.getElementById('current-humidity'); 
const currentPressure = document.getElementById('current-pressure');
const currentWind = document.getElementById('current-wind'); 

// searchHistory elements
const searchHistoryContainer = document.getElementById('searchHistory-container');
const searchHistoryList = document.getElementById('searchHistory-list')