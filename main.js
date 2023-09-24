const express = require('express');
const path = require('path');
const app = express();
const https = require('https');
const bodyParser = require('body-parser');


const date = new Date();

let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

let monthName;

switch (month) {
    case 0:
        monthName = "Jan";
        break;
    case 1:
        monthName = "Feb";
        break;
    case 2:
        monthName = "Mar";
        break;
    case 3:
        monthName = "Apr";
        break;
    case 4:
        monthName = "May";
        break;
    case 5:
        monthName = "June";
        break;
    case 6:
        monthName = "July";
        break;
    case 7:
        monthName = "Aug";
        break;
    case 8:
        monthName = "Sep";
        break;
    case 9:
        monthName = "Oct";
        break;
    case 10:
        monthName = "Nov";
        break;
    case 11:
        monthName = "Dec";
        break;
    default:
        break;
}

let todayDate = `${day}-${monthName}-${year}`;
let todayTime = date.toLocaleTimeString();

const file = path.dirname(__filename);

app.use(express.static(path.resolve(file + "/public")));
app.use(express.static("public"));
app.use(bodyParser.json());

app.use(express.static("public/images"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.render(path.resolve(file + "/views/front.ejs"));
});

app.post('/next', async (req, res) => {
    var city1 = req.body.cityName;
    var city2 = req.body.cityNameP2;


    let urlCity1 = `https://api.openweathermap.org/data/2.5/weather?q=${city1}&appid=2a66cf57d88779757906fe6d201b4dea&units=metric`;
    let urlCity2 = `https://api.openweathermap.org/data/2.5/weather?q=${city2}&appid=2a66cf57d88779757906fe6d201b4dea&units=metric`;


    let url = city1 ? urlCity1 : urlCity2;

    https.get(url, (response) => {
        response.statusCode === 200 ? response.on('data', (data) => {

            let weatherData = JSON.parse(data);

            var description = weatherData.weather[0].description;
            var wIcon = weatherData.weather[0].icon;
            var wIconImg = "http://openweathermap.org/img/w/" + wIcon + ".png";
            var countryCode = weatherData.sys.country;
            var temp = Math.round(weatherData.main.temp);
            var tempF = Math.round((temp * 9 / 5) + 32);
            var tFeels = weatherData.main.feels_like;

            var tempMin = weatherData.main.temp_min;
            var tempMax = weatherData.main.temp_max;
            var pressure = weatherData.main.pressure;
            var humidity = weatherData.main.humidity;
            var windS = weatherData.wind.speed;
            var windDeg = weatherData.wind.deg;

            res.render(path.resolve(file + "/views/nextP.ejs"), {
                countryCode: countryCode, todayDate, todayTime,resp:0,
                location: weatherData.name, clouds: description, src: wIconImg, temp, tFeels: tFeels, tempF: tempF,
                tempMinimum: tempMin, tempMaximum: tempMax, pressure: pressure, humidity: humidity, windSpeed: windS, windDegree: windDeg
            });
        }) : 
        res.render(path.resolve(file + "/views/nextP.ejs"), 
        {
            resp:404,error:"error "
        });
    })
});



const port = 8000;

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})