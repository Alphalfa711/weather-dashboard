/**
 * Get approximate location
 * source https://www.geolocation-db.com/documentation
 * @param {object} data 
 */
function callback(data) {
  getResults(data.latitude, data.longitude, false);
}

function getApproximateLocation () {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://geolocation-db.com/jsonp';
  var h = document.getElementsByTagName('script')[0];
  h.parentNode.insertBefore(script, h);
}


/**
* Allow the browser to get your location 
* source 
* https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/longitude
*/
var locationBtn = document.getElementById("get-location");

locationBtn.addEventListener("click", () => {

  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    // Pass current latitude and longitude to function that will handle API request
    getResults(lat, long, false);
  });
});

/**
 * Check to make sure user entered text into field
 * If field is not empty pass it's value to function that handle API request
 */
searchBtn.addEventListener('click', function () {
  var query = searchText.value;
  if (query) {
    // searchText.value = "";
    getCoordinates(query);
  } else {
    alert("Search value cannot be blank")
  }
})

/**
 * Pass users query and attempt to get coordinates from API call
 * @param {string} searchQuery 
 */
function getCoordinates(searchQuery) {

  const apiUrlQuery = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchQuery + '&limit=5&appid=e97ee8621afbdf55e3cfc6d7bc09d848';

  fetch(apiUrlQuery)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw (error);
      }
    }).then(function (data) {
      /**
       * data object returns up to 5 city object if search city excists in multiple states or countries
       * MVP
       * Test pass first results to open weather
       */
      searchText.value = "";
      getResults(data[0].lat, data[0].lon, true)  
      // if (data.length === 1) {
      //   searchText.value = "";
      //   getResults(data[0].lat, data[0].lon, true)  
      // } else {
      //   searchText.value = "";
      //   getResults(data[0].lat, data[0].lon, true)  
        // data.forEach(element => {
        //   let resultOption = document.createElement('option');
        //       resultOption.setAttribute('value', element.name);
        //   searchDataList.appendChild(resultOption);
        // });
      // }      
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather");
      console.log(error);
    });
};

/**
 * 
 * @param {float} lat 
 * @param {float} long 
 * @param {boolean} updateSearchHistory 
 * if true save search city in local storage
 */
function getResults(lat, long, updateSearchHistory) {

  // current weather API call    
  let currentApi = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&lang=en&appid=e97ee8621afbdf55e3cfc6d7bc09d848&units=imperial';
  
  fetch(currentApi, {
    cache: 'reload',
    })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {

          // Update local storage
          if (updateSearchHistory) {
            // Object that will be added to local storage
            let locationObject = {
              name: data.name,
              lat: data.coord.lat,
              lon: data.coord.lon
            }
            // Check to see if search city already excists in local storage
            let newItem = true;
            searchHistoryArray.forEach(element => {
              if (data.name === element.name) {
                newItem = false;
              }
            });
            // If user search for new city update and render local storage
            if (newItem) {
              searchHistoryArray.push(locationObject);
              updateLocalStorage();
              renderLocalStorage();
            }
          }

          // Show time of fetch
          // Source https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
          let fetchedTime = new Date(data.dt * 1000).toLocaleTimeString();
          let fetchedDate = new Date(data.dt * 1000).toLocaleDateString();
          // Update DOM elements
          renderCurrentResults(data, fetchedTime, fetchedDate);
        })
      } else {
        alert('Error: ' + response.status)
      }
    })


    // Forcast API call
    // Forcast call
    let forcastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&lang=en&appid=e97ee8621afbdf55e3cfc6d7bc09d848&units=imperial';
      fetch(forcastApiUrl, {
        cache: 'reload'
        })
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (futureData) {
              // Clear forcast DOM elements
              forecastContainer.innerHTML = "";        
              formatForcastData(futureData);
            });
          }
      })
}


/**
 * Update elements on the page in current weather card
 * @param {object} data 
 */
function renderCurrentResults(data, timeF, dateF) {
  fetchDate.textContent = dateF;
  fetchTime.textContent = timeF;
  currentCity.textContent = data.name;
  currentWeatherIcon.setAttribute('alt', "weather icon");
  currentWeatherIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png')
  currentDesc.textContent = data.weather[0].description;
  currentTemp.textContent = Math.round(data.main.temp);
  currentFeelsLike.textContent = Math.round(data.main.feels_like);
  currentHumidity.textContent = data.main.humidity;
  currentPressure.textContent = data.main.pressure;
  currentWind.textContent = data.wind.speed;
}


function formatForcastData(futureData) {
  // Retrieve element at noon time for each day
  const futureDataPoints = futureData.list.filter(element => {
    return element.dt_txt.endsWith("12:00:00");
    })

    // Display results from each day at noon time
    futureDataPoints.forEach(element => {
      renderFutureResults(element);
    })
}


function renderFutureResults(futureDataPoint) {
  // Create DOM elements
  const forecastRow = document.createElement('div');
        forecastRow.setAttribute('class', 'row py-3 py-md-0 align-items-center')

    // Day / Date Section
    // Build
    const forecastDateSection = document.createElement('div')
          forecastDateSection.setAttribute('class', 'col-12 col-md-2 order-1 d-flex flex-md-column gap-4 gap-md-0');

      const forecastDay = document.createElement('p');
            forecastDay.setAttribute('class', 'm-0 fs-6 text-warning');
            forecastDay.textContent = dayjs(futureDataPoint.dt * 1000).format('dddd');
      const forecastDate = document.createElement('p');
            forecastDate.setAttribute('class', 'm-0 fs-6 text-warning');
            forecastDate.textContent = dayjs(futureDataPoint.dt * 1000).format('MMM DD');
      // Append
      forecastDateSection.appendChild(forecastDay);
      forecastDateSection.appendChild(forecastDate);

      forecastRow.appendChild(forecastDateSection);
    
      // Temp section
    const forecastTempSection = document.createElement('div');
          forecastTempSection.setAttribute('class', 'col-6 col-md-2 order-2 d-flex flex-column align-items-center');
      const forecastTemp = document.createElement('p');
            forecastTemp.setAttribute('class', 'm-0 fs-2 text-center');
            forecastTemp.innerHTML = parseInt(futureDataPoint.main.temp) + ('&#176') + "F";

          forecastTempSection.appendChild(forecastTemp);
          forecastRow.appendChild(forecastTempSection);
    
    // Icon section
    // Build
    const forecastIconSection = document.createElement('div');
          forecastIconSection.setAttribute('class', 'col-6 col-md-2 order-3 d-flex flex-column align-items-center');
    const forecastIcon = document.createElement('img');
          forecastIcon.setAttribute('class', 'm-0 fs-3 text-center');
          forecastIcon.setAttribute('alt', 'weather icon');
          forecastIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + futureDataPoint.weather[0].icon + '@2x.png');
    // Append
          forecastIconSection.appendChild(forecastIcon);
          forecastRow.appendChild(forecastIconSection); 

    // Humidity section
    // Build
    const forecastHumiditySection = document.createElement('div');
          forecastHumiditySection.setAttribute('class', 'col-4 col-md-2 order-4 d-flex flex-column align-items-center');

      const forecastHumidityText = document.createElement('p');
            forecastHumidityText.setAttribute('class', 'm-0 fs-6');
            forecastHumidityText.textContent = "Humidity";
      const forecastHumidityValue = document.createElement('p');
            forecastHumidityValue.setAttribute('class', 'm-0 fs-6');
            forecastHumidityValue.textContent = futureDataPoint.main.humidity + '%';
      // Append
            forecastHumiditySection.appendChild(forecastHumidityText);
            forecastHumiditySection.appendChild(forecastHumidityValue);
    
            forecastRow.appendChild(forecastHumiditySection); 

      // Rain section
      // Build
      const forecastWindSection = document.createElement('div');
            forecastWindSection.setAttribute('class', 'col-4 col-md-2 order-5 d-flex flex-column align-items-center');

        const forecastWindText = document.createElement('p');
              forecastWindText.setAttribute('class', 'm-0 fs-6');
              forecastWindText.textContent = "Wind";
        const forecastWindValue = document.createElement('p');
              forecastWindValue.setAttribute('class', 'm-0 fs-6');
              forecastWindValue.textContent = futureDataPoint.wind.speed + 'MPH';
      // Append
              forecastWindSection.appendChild(forecastWindText);
              forecastWindSection.appendChild(forecastWindValue);
      
              forecastRow.appendChild(forecastWindSection); 

      // Rain section
      // Build
      const forecastPressureSection = document.createElement('div');
            forecastPressureSection.setAttribute('class', 'col-4 col-md-2 order-5 d-flex flex-column align-items-center');
  
        const forecastPressureText = document.createElement('p');
              forecastPressureText.setAttribute('class', 'm-0 fs-6');
              forecastPressureText.textContent = "Pressure";
        const forecastPressureValue = document.createElement('p');
              forecastPressureValue.setAttribute('class', 'm-0 fs-6');
              forecastPressureValue.textContent = futureDataPoint.main.pressure + 'hPs';
      // Append
              forecastPressureSection.appendChild(forecastPressureText);
              forecastPressureSection.appendChild(forecastPressureValue);
      
              forecastRow.appendChild(forecastPressureSection); 

      // Display generated DOM elements on page
      forecastContainer.appendChild(forecastRow);
}

/**
 * Search searchHistory
 */
searchHistoryContainer.addEventListener('click', function (event) {
  const element = event.target;
  
  // X icon click event - delete from local storage
  // li element click event - fetch weather for city in list item
  if (element.matches('i') === true) {
    const index = element.parentElement.getAttribute("data-index");
    searchHistoryArray.splice(index, 1);
    updateLocalStorage();
    renderLocalStorage();
  } else if (element.matches('li')) {
    let lat = element.getAttribute('data-lat');
    let long = element.getAttribute('data-lon');
    getResults(lat, long, false);
  }
})

// Update local storage
function updateLocalStorage() {
  localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray));
}

// Get cities stored in local storage and append them as list items in search container
function renderLocalStorage() {
  searchHistoryList.innerHTML = "";

  searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory"));

  // Dynamically load items from local storage
  // pass lat and long values from each object in local storage to data attributes
  if (searchHistoryArray) {
    searchHistoryArray.forEach((element, index) => {
      const searchHistoryListItem = document.createElement('li')
      searchHistoryListItem.setAttribute('data-index', index);
      searchHistoryListItem.setAttribute('data-lat', element.lat);
      searchHistoryListItem.setAttribute('data-lon', element.lon);
      searchHistoryListItem.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center my-1')
      searchHistoryListItem.textContent = element.name;
      const closeIcon = document.createElement('i');
      closeIcon.setAttribute('class', 'fa-solid fa-xmark');     

      searchHistoryListItem.appendChild(closeIcon);
      searchHistoryList.appendChild(searchHistoryListItem)
    });
  } else {    
    searchHistoryArray = [];
  }
}

/**
 * Define staatup behaviour / routine
 * Check to see if local storage excist and if yes display weather for city that was searched last
 * If no local storage get approximate user location and display weather in the area
 */
function init() {
  renderLocalStorage();
  
  if (searchHistoryArray.length > 0) {
    const lastArrayItem = searchHistoryArray.length - 1;
    getResults(searchHistoryArray[lastArrayItem].lat, searchHistoryArray[lastArrayItem].lon, false);
  } else {
    getApproximateLocation();
  }
}

// Initialize startup routine
init();

