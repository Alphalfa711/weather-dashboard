var searchText = document.getElementById('searchText');
var searchBtn = document.getElementById('searchBtn');
var searchedArray = [];

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
    getResults(lat, long);
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

  var apiUrlQuery = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchQuery + '&limit=5&appid=e97ee8621afbdf55e3cfc6d7bc09d848'

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
      getResults(data[0].lat, data[0].lon)
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather");
      console.log(error);
    });
};


function getResults(lat, long) {


  let apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='
    + lat + '&lon=' + long
    + '&appid=e97ee8621afbdf55e3cfc6d7bc09d848'

  // let apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?id=paris,fr&appid=e97ee8621afbdf55e3cfc6d7bc09d848'
  let apiUrl2 = 'https://api.openweathermap.org/data/2.5/forecast?id=Matawan,NJ,US&appid=e97ee8621afbdf55e3cfc6d7bc09d848'
  // let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=e97ee8621afbdf55e3cfc6d7bc09d848'


  // current weather        
  currentApi = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=e97ee8621afbdf55e3cfc6d7bc09d848';

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
  // for (let i = 0; i < data.)
  console.log('hello');

  let weatherResultsContainer = document.getElementById('weather-results');

  let weatherResultsTitle = document.createElement('h2');
  weatherResultsTitle.textContent = data.name;

  weatherResultsContainer.appendChild(weatherResultsTitle);

  searchedArray.push(data.name);
  updateLocalStorage();
  renderLocalStorage();
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

  if (searchedArray.length > 0) {
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
  }
}




renderLocalStorage();