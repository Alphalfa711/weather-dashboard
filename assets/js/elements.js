// Local storage
let searchHistoryArray = JSON.parse(localStorage.getItem("search-history"));

// Search elements
const searchText = document.getElementById('search-text');
const searchBtn = document.getElementById('search-btn');
const searchResultsList = document.getElementById('search-results-list')

// searchHistory elements
const searchHistoryContainer = document.getElementById('search-history-container');
const searchHistoryList = document.getElementById('search-history-list')

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