/**
 * Get approximate location
 * source https://www.geolocation-db.com/documentation
 * @param {object} data 
 */

function callback(data) {
  console.log("🚀 ~ file: script.js:8 ~ callback ~ data", data)
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
    console.log("🚀 ~ file: script.js:35 ~ navigator.geolocation.getCurrentPosition ~ lat", lat)
    let long = position.coords.longitude;
    console.log("🚀 ~ file: script.js:37 ~ navigator.geolocation.getCurrentPosition ~ long", long)
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
      console.log("🚀 ~ file: script.js:116 ~ data", data)
      //! Test pass first results to open weather
      if (data.length === 1) {
        searchText.value = "";
        getResults(data[0].lat, data[0].lon, true)  
      } else {
        searchText.value = "";
        getResults(data[0].lat, data[0].lon, true)  
        // data.forEach(element => {
        //   let resultOption = document.createElement('option');
        //       resultOption.setAttribute('value', element.name);
        //   searchDataList.appendChild(resultOption);
        // });
      }      
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather");
      console.log(error);
    });
};


function getResults(lat, long, updateSearchHistory) {

  // current weather API call    
  let currentApi = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&lang=en&appid=e97ee8621afbdf55e3cfc6d7bc09d848&units=imperial';
  
  fetch(currentApi, {
    // method: "GET",
    // headers: {
      // cache: 'no-store'
      // "Cache-Control": 'no-store ',
    // }
  // fetch(currentApi, {
    cache: 'reload'
    // headers: {
    // "Cache-Control": 'no-cache, no-store'
    // cache: 'no-cache'
    // cache: 'no-store'
    // "Cache-Control": "no-store, no-cache"
    // "Cache-Control": "max-age=0"
    // }
    })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          // console.log("🚀 ~ file: script.js:157 ~ data", data)
          
          let locationObject = {
            name: data.name,
            lat: data.coord.lat,
            lon: data.coord.lon
          }

          if (updateSearchHistory) {

            let newItem = true;
            searchHistoryArray.forEach(element => {
              if (data.name === element.name) {
                newItem = false;
              }
            });

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
      // cache: 'no-cache'
      })
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (futureData) {
            console.log("🚀 ~ file: script.js:157 ~ futureData", futureData)
            formatForcastData(futureData);
          });
        }
    })
}


/**
 * Update elements on the page
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

  const day1 = [];
  const day2 = [];
  const day3 = [];
  const day4 = [];
  const day5 = [];

  // day1.push(futureData.list[0])
  futureData.list.forEach((element, index) => {
    if (index < 8) {
      day1.push(element);
    } else if (index < 16) {
      day2.push(element);
    } else if (index < 24) {
      day3.push(element);
    } else if (index < 32) {
      day4.push(element);
    } else {
      day5.push(element);
    }
  });
  
  console.log(day1)
  console.log(day2)
  console.log(day3)
  console.log(day4)
  console.log(day5)


  // renderFutureResults(futureData);
}




function renderFutureResults(futureData) {
  const forcastListArray = futureData.list
  // console.log("🚀 ~ file: script.js:196 ~ renderFutureResults ~ forcastListArray:", forcastListArray)
  // console.log(futureData.city)


  
  // const forcastDay = futureData
}

/**
 * Search searchHistory
 */

searchHistoryContainer.addEventListener('click', function (event) {
  const element = event.target;

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


renderLocalStorage();

if (searchHistoryArray.length > 0) {
  const lastArrayItem = searchHistoryArray.length - 1;
  getResults(searchHistoryArray[lastArrayItem].lat, searchHistoryArray[lastArrayItem].lon, false);
} else {
  getApproximateLocation();
}