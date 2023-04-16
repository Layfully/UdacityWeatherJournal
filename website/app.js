/* Global Variables */
const apiKey = '976106a6c59595f35e90fff06a09ffe9&units=imperial';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

const getRoute = '/getData';
const postRoute = '/addData';

const sendButton = document.getElementById('generate');
const zipElement = document.getElementById('zip');
const contentElement = document.getElementById('feelings');
const entryTitleElement = document.getElementById('entryTitle');
const dateEntryElement = document.getElementById('date');
const temperatureEntryElement = document.getElementById('temp');
const contentEntryElement = document.getElementById('content');
const errorElement = document.getElementById('error');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

async function getWeatherData(zipCode) {
    const url = `${baseUrl}?zip=${zipCode}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function getData(url = '') {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const newData = await response.json();
    return newData;
}

function updateUI(data) {
    const isDataPresent = Object.keys(data).length !== 0;

    entryTitleElement.innerHTML = isDataPresent ? 'Most recent entry:' : 'No entries found';
    dateEntryElement.innerHTML = isDataPresent ? `Date: ${data.date}` : '';
    temperatureEntryElement.innerHTML = isDataPresent ? `Temperature: ${Math.round(data.temp)} degrees` : '';
    contentEntryElement.innerHTML = isDataPresent ? `Feelings: ${data.content}` : '';
}

function send(event) {
    getWeatherData(zipElement.value)
        .then(weatherData => {
            postData(postRoute, { 'date': newDate, 'temp': weatherData.main.temp, 'content': contentElement.value }).then(data => {
                updateUI(data)
            })
            .catch(error => {
                showError(`Couldn't get a response from server, please make sure its running`);
                console.log(error);
            });
        })
    .catch(error => { 
        showError(`Couldn't get a response from weather API, please make sure every field is filled out correctly`);
        console.log(error);
    });
}

function initializeData(event) {
    getData(getRoute)
        .then(data => {
            updateUI(data)
        })
        .catch();
}

function showError(message) {
    error.style.display = 'block';
    error.innerHTML = `
        <h1>Error</h1>
        <p>${message}</p>
    `;

    setTimeout(() => { error.style.display = 'none'; }, 3000)
}

sendButton.addEventListener('click', send)
window.addEventListener('DOMContentLoaded', initializeData);