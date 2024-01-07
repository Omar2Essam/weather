// get API data 

var newXMLHttp = new XMLHttpRequest();

function getCity(q) {
    newXMLHttp.open('get', `https://api.weatherapi.com/v1/forecast.json?key=fab304cd7daf4049ac7143320240301&q=${q}&days=33`);

    newXMLHttp.addEventListener('readystatechange', function () {
        if (newXMLHttp.readyState == 4) {
            var city = '';
            city += `
        <div class="myFont fs-4">${JSON.parse(newXMLHttp.response).location.name}</div>
        <div class="degree">
        <div class="num">${Math.round(Number((JSON.parse(newXMLHttp.response).current.temp_c)))}<sup>o</sup>C</div>
        <div class="forecast-icon">
            <img src="https:${JSON.parse(newXMLHttp.response).current.condition.icon}" alt="" width=90>
        </div>
        <h6 class="myFont text-info mx-3">${JSON.parse(newXMLHttp.response).current.condition.text}</h6>	
        </div>
        <i class="fa-solid fa-umbrella px-1"></i><span>${JSON.parse(newXMLHttp.response).current.humidity}%</span>
        <i class="fa-solid fa-wind px-1"></i><span>${JSON.parse(newXMLHttp.response).current.wind_kph} km/h<span>
        <i class="fa-regular fa-compass ps-4 pe-1"></i><span>East</span>
        `;
            var nextDays = '';
            nextDays += `
        <div class="forecast-icon">
        <img src="https:${JSON.parse(newXMLHttp.response).forecast.forecastday[0].day.condition.icon}" alt="" width=48>
        </div>
        <div class="degree">${Math.round(JSON.parse(newXMLHttp.response).forecast.forecastday[0].day.maxtemp_c)}<sup>o</sup>C</div>
        <small>${Math.round(JSON.parse(newXMLHttp.response).forecast.forecastday[0].day.mintemp_c)}<sup>o</sup></small><i class="fa-solid fa-temperature-three-quarters px-1"></i>
        <h6 class="myFont text-info mx-3 my-3 fs-5">${JSON.parse(newXMLHttp.response).forecast.forecastday[0].day.condition.text}</h6>
        `
            var dayAfterNext = ``;

            dayAfterNext += `
        <div class="forecast-icon">
        <img src="https:${JSON.parse(newXMLHttp.response).forecast.forecastday[1].day.condition.icon}" alt="" width=48>
        </div>
         <div class="degree">${Math.round(JSON.parse(newXMLHttp.response).forecast.forecastday[1].day.maxtemp_c)}<sup>o</sup>C</div>
         <small>${Math.round(JSON.parse(newXMLHttp.response).forecast.forecastday[1].day.mintemp_c)}<sup>o</sup></small><i class="fa-solid fa-temperature-three-quarters px-1"></i>
        <h6 class="myFont text-info mx-3 my-3 fs-5">${JSON.parse(newXMLHttp.response).forecast.forecastday[1].day.condition.text}</h6>
        
        `;

            document.getElementById('city').innerHTML = city;
            document.getElementById("nextDay").innerHTML = nextDays;
            document.getElementById("dayAfterNext").innerHTML = dayAfterNext;

        }
    });

    newXMLHttp.send();
}
getCity('Obour');


// Get today's date
const currentDate = new Date();

// Get the next two days
const nextDay = new Date(currentDate);
nextDay.setDate(currentDate.getDate() + 1);

const dayAfterTomorrow = new Date(nextDay);
dayAfterTomorrow.setDate(nextDay.getDate() + 1);

// Format each day
const options = { weekday: 'long' };

const today = currentDate.toLocaleDateString('en-US', options);
const tomorrow = nextDay.toLocaleDateString('en-US', options);
const dayAfterTomorrowFormatted = dayAfterTomorrow.toLocaleDateString('en-US', options);


// store month's names

const months = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
];

const day = currentDate.getDate();
const month = months[currentDate.getMonth()];
const formatMonth = `${day} ${month}`
console.log(formatMonth)
// display date && week day in document

var toDay = '';
var tommorow = '';
var dayAfterTommorrow = '';

toDay = `
<div class="day myFont fs-4">${today}</div>
<div class="date myFont fs-4 px-3">${formatMonth}</div>
`;
tommorow = `
<div class="day myFont fs-4">${tomorrow}</div>
`
dayAfterTommorrow = `
<div class="day myFont fs-4">${dayAfterTomorrowFormatted}</div>

`

document.getElementById("today").innerHTML = toDay;
document.getElementById("tommorow").innerHTML = tommorow;
document.getElementById("dayAfterTommorrow").innerHTML = dayAfterTommorrow;

// get city name input

var citName = document.getElementById("cityName")
citName.addEventListener('keyup', function (e) {
    getCity(e.target.value);

});

// Declare global variables to store latitude and longitude
let globalLatitude;
let globalLongitude;

function geoFindMe() {
    const mapLink = document.getElementsByClassName("mapLink");

    mapLink.href = "";
    mapLink.textContent = "";

    // Create a promise to handle asynchronous operations
    const promise = new Promise((resolve, reject) => {
        function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
            mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;

            // Store values in global variables
            globalLatitude = latitude;
            globalLongitude = longitude;

            // Print to console
            console.log("Latitude:", globalLatitude);
            console.log("Longitude:", globalLongitude);

            // Resolve the promise to indicate success
            resolve();
        }

        function error() {
            // Reject the promise in case of an error
            reject();
        }

        if (!navigator.geolocation) {
            // Reject the promise if geolocation is not supported
            reject();
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }
    });

    // Return the promise to allow chaining
    return promise;
}

function secondFunction() {
    var location = new XMLHttpRequest();

    location.open('get', `https://api.opencagedata.com/geocode/v1/json?q=${globalLatitude}+${globalLongitude}&key=c3120a8a259a41de9766784408cfe8d6`);

    location.addEventListener('readystatechange', function () {
        if (location.readyState == 4) {
            var valueX = JSON.parse(location.response).results[0].components.state;

            // Update the input field with ID "cityName"
            document.getElementById("cityName").value = valueX;
            getCity(valueX)
        }
    });

    location.send();
}

// Attach click event to the button
document.getElementById("findMe").addEventListener("click", () => {
    // Call geoFindMe and then chain the execution of secondFunction
    geoFindMe().then(secondFunction);
});