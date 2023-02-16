/**
 * Get approximate location
 * source https://www.geolocation-db.com/documentation
 * @param {object} data 
 */

function callback(data) {
  console.log(data)
  getResults(data.latitude, data.longitude, false);
}

function getApproximateLocation () {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://geolocation-db.com/jsonp';
  var h = document.getElementsByTagName('script')[0];
  h.parentNode.insertBefore(script, h);
}



var searchText = document.getElementById('searchText');
var searchBtn = document.getElementById('searchBtn');
var weatherResultsContainer = document.getElementById('weather-results');
var searchedArray = JSON.parse(localStorage.getItem("searched"));




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

  var apiUrlQuery = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchQuery + '&limit=5&appid=e97ee8621afbdf55e3cfc6d7bc09d848'

  fetch(apiUrlQuery)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw (error);
      }
    }).then(function (data) {
      console.log(data)
      //! Test pass first results to open weather
      getResults(data[0].lat, data[0].lon, true)
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather");
      console.log(error);
    });
};


function getResults(lat, long, updateHistory) {


  let apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='
    + lat + '&lon=' + long
    + '&appid=e97ee8621afbdf55e3cfc6d7bc09d848'

  // let apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?id=paris,fr&appid=e97ee8621afbdf55e3cfc6d7bc09d848'
  let apiUrl2 = 'https://api.openweathermap.org/data/2.5/forecast?id=Matawan,NJ,US&appid=e97ee8621afbdf55e3cfc6d7bc09d848'
  // let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=e97ee8621afbdf55e3cfc6d7bc09d848'


  // current weather        
  currentApi = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&lang=en&appid=e97ee8621afbdf55e3cfc6d7bc09d848&units=imperial';

  // var docBody = document.getElementById('container')
  // docBody.appendChild(mapPic)

  //! http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}
  //! API call to get geo coordinates to pass into forcast call

  // fetch(apiUrl)
  fetch(currentApi)
    .then(function (response) {
      // console.log(response)
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          
          if (updateHistory) {
            searchedArray.push(data.name);
            updateLocalStorage();
            renderLocalStorage();
          }
          renderResults(data);
        })
      } else {
        alert('Error: ' + response.status)
      }
    })
}


/**
 * Update elements on the page
 * @param {object} data 
 */
function renderResults(data) {
  console.log("🚀 ~ file: script.js:142 ~ renderResults ~ data", data)
  // for (let i = 0; i < data.)
  // console.log(data);

  let weatherResultsTitle = document.createElement('h2');
  weatherResultsTitle.textContent = data.name;

  weatherResultsContainer.appendChild(weatherResultsTitle);
  
  let weatherIcon = document.createElement('img');
      weatherIcon.setAttribute('alt', "weather icon");
      // weatherIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + data.weather + '@2x.png')
      weatherIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');

  weatherResultsContainer.appendChild(weatherIcon);

}


/**
 * Search history
 */
var historyContainer = document.getElementById('history-container');
var historyList = document.getElementById('history-list')

historyContainer.addEventListener('click', function (event) {
  let element = event.target;

  if (element.matches('i') === true) {
    let index = element.parentElement.getAttribute("data-index");
    searchedArray.splice(index, 1);


    updateLocalStorage();
    renderLocalStorage();
  }

})

//todo if no lat or long / check for localstorate and use last location searched, if not local storage display modal with search - first time after user load the page
//todo update local storage
//todo render local storage
function updateLocalStorage() {
  localStorage.setItem("searched", JSON.stringify(searchedArray));
}


function renderLocalStorage() {
  historyList.innerHTML = "";

  searchedArray = JSON.parse(localStorage.getItem("searched"));

  if (searchedArray) {
    searchedArray.forEach((element, index) => {
      var historyListItem = document.createElement('li')
      historyListItem.setAttribute('data-index', index);
      historyListItem.setAttribute('class', 'my-2')
      historyListItem.textContent = element;
      var closeIcon = document.createElement('i');
      closeIcon.setAttribute('class', 'fa-solid fa-xmark btn');

      historyListItem.appendChild(closeIcon);
      historyList.appendChild(historyListItem)
    });
  } else {
    searchedArray = [];
  }
}



getApproximateLocation();
renderLocalStorage();