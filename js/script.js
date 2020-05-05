/*{"coord":{"lon":-0.13,"lat":51.51},
"weather":[{"id":300,"main":"Drizzle","description":"light intensity drizzle","icon":"09d"}],
"base":"stations",
"main":{"temp":280.32,"pressure":1012,"humidity":81,"temp_min":279.15,"temp_max":281.15},
"visibility":10000,
"wind":{"speed":4.1,"deg":80},
"clouds":{"all":90},
"dt":1485789600,
"sys":{"type":1,"id":5091,"message":0.0103,"country":"GB","sunrise":1485762037,"sunset":1485794875},
"id":2643743,
"name":"London",
"co d":200}*/
//let city_list =
let weather_report = {};//object with data from api
let city_choice = {};   //object for city data for api request
let cities = [];        //array of cities filtered from json

const weather_data_box = document.getElementById("data-display");//container for map and api answer
weather_data_box.hidden = true;// initially hidden
const city_choice_box = document.getElementById("city_choice");
const city_choice_container = document.getElementById("select_place");
city_choice_container.hidden = true;
document.getElementById('city').addEventListener('submit', getCityId);
document.getElementById('select_place').addEventListener('change', selectedValue);

//showMap(16.338499, 50.872501);

function selectedValue(e) {

    console.log('poszukiwane', e.target.value);
    for (let i = 0; i < cities.length; i++) {
        console.log(i, cities[i].id);
        if (cities[i].id == e.target.value) {
            console.log('id found', e.target.value, cities[i].id);
            city_choice = Object.assign(city_choice, cities[i]);
        }
    }
    console.log('zapisany obiekt', city_choice);

    showMap(city_choice.coord.lon, city_choice.coord.lat);
    loadWeather(city_choice.id);
}

function getCityId(e) {
    e.preventDefault();
    let cityName = document.getElementById('inputCity').value;
    console.log('podane miasto: ', cityName);
    cities_list(cityName);
}





function cities_list(city) {
    city_choice_container.hidden = false;
    console.log('cleaning cities array');
    let city_choice_output = '<option>-----choose one-------</option>';
    cities = [];
    fetch('json/city.list.json')
        .then(res => res.json())
        .then(data => {
            //console.log('loaded cities:', data);
            for (let i = 0; i < data.length; i++) {
                if (data[i].name == city) {
                    cities.push(data[i]);
                    //console.log(i, data[i].name, data[i].country, data[i].coord.lon, data[i].coord.lat);
                    city_choice_output += `<option value = "${data[i].id}">${data[i].name},${data[i].country},${data[i].state}</option>`;
                    //console.log(i, city_choice_output);
                }
            };
            console.log(cities);

            city_choice_box.innerHTML = city_choice_output;


        })
        .catch(err => console.log(err));
}


function loadWeather(id) {
    console.log('function started');
    let url = `https://api.openweathermap.org/data/2.5/weather?id=${id}&APPID=a9e9a47d0a7f69f8f9860443a2752a5b&units=metric`
    var request = new XMLHttpRequest();
    console.log(request);
    request.open('GET', url, true);

    request.onload = function () {
        let api_answer = JSON.parse(this.response);
        console.log('req status: ', request.status)
        if (request.status >= 200 && request.status < 400) {
            console.log('status OK');
            console.log(api_answer);
            console.log(api_answer.name, api_answer.sys.country, api_answer.weather[0].description);
            weather_report = Object.assign(weather_report, api_answer)
            console.log('zapisany obiekt z api:', weather_report);
            display_data()
        } else {
            console.log('error');
        }
    }
    request.send();
}


function showMap(lon, lat) {
    console.log("map function");
    weather_data_box.hidden = false;
    mapboxgl.accessToken = 'pk.eyJ1IjoibGhhenkxMTEiLCJhIjoiY2s5dHBxZnBjMDBtZzNmczN4ejAyN2NrbiJ9.J4GKXNr2A_vGhv4p7yuQWA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lon, lat],
        zoom: 12
    });
    var marker = new mapboxgl.Marker()
        .setLngLat([lon, lat])
        .addTo(map);
}

function display_data() {
    console.log('display data started');
    console.log(`<img src='http://openweathermap.org/img/wn/10d@2x.png'></img>`);
    //displaying data from api----------------------------------------------------------------
    document.getElementById('api_city').innerHTML = weather_report.name;
    document.getElementById('api_country').innerHTML = weather_report.sys.country;
    document.getElementById('api_coords').innerHTML = `${weather_report.coord.lon}, ${weather_report.coord.lat}`;
    document.getElementById('api_weather').innerHTML = weather_report.weather[0].description;
    document.getElementById('api_temp').innerHTML = weather_report.main.temp;
    document.getElementById('api_temp_min').innerHTML = weather_report.main.temp_min;
    document.getElementById('api_temp_max').innerHTML = weather_report.main.temp_max;
    document.getElementById('api_feels').innerHTML = weather_report.main.feels_like;
    document.getElementById('api_pressure').innerHTML = weather_report.main.pressure;
}



