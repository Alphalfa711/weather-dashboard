var searchText = document.getElementById('searchText');
var searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', function () {

    var query = searchText.value;

    if (query) {
        displayResults(query);
    } else {
        alert("Search value cannot be blank")
    }
})


function displayResults(searchQuery) {

    var apiUrlQuery = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchQuery + '&limit=5&appid=e97ee8621afbdf55e3cfc6d7bc09d848'

    fetch(apiUrlQuery)
        .then(function (response) {
            return response.json();
        }).then(function (data) {

            console.log(data)
        })
}

var test = 'sadfasdf'



/**
* Allow the browset o get your location 
* source 
* https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/longitude
*/

var locationBtn = document.getElementById("get-location");
    
locationBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;

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
                console.log(response)
                if (response.ok) {
                    response.json().then(function (data) {
                        console.log(data);
                        appendElements(data);
                    })
                } else {
                    alert('Error: ' + response.status)
                }
            })
    });
});

function getResults(lat, long, apiUrl) {

}

function appendElements(data) {
    // for (let i = 0; i < data.)

}