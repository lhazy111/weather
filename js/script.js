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
let weather_report = {};
let city_choice = {};
let cities = [];
let city_choice_output = '<option>-----choose one-------</option>';
const weather_data_box = document.getElementById("data-display");
const city_choice_box = document.getElementById("select_place");
document.getElementById("select_place").style.display = "none";
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
    fetch('city.list.json')
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
            document.getElementById("select_place").style.display = "initial";


        })
        .catch(err => console.error(err));
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

/*let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.github.com/users');
console.log('onreadystatechange: ', xhr.onreadystatechange)

// request state change event
xhr.onload = function () {

    // request completed?
    if (xhr.readyState !== 4) return;

    if (xhr.status === 200) {
        // request successful - show response
        console.log('xml resp ok', xhr.responseText);
    }
    else {
        // request error
        console.log('HTTP error', xhr.status, xhr.statusText);
    }
};
xhr.send();
*/
function showMap(lon, lat) {
    mapboxgl.accessToken = 'pk.eyJ1IjoibGhhenkxMTEiLCJhIjoiY2s5c2UwZWp0MDFwYzNubGoxeGJ5cGhnayJ9.YLFn6W3kM6jbxOSsxcOwYQ';
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

}



