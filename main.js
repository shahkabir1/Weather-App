import './style.css'
import { getWeather } from "./weather"
import { ICON_MAP } from "./iconMap"

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess( {coords}) {
    getWeather(coords.latitude, coords.longitude, Intl.DateTimeFormat().resolvedOptions().timeZone)
    .then(renderWeather)
    .catch(e => {
        console.error(e)
        alert("Error getting weather.")
    })
}


function positionError() {
    alert("There was an error getting your location. Please allow us to use your location and refresh the page.")
}
function renderWeather({ current, daily}) {
    renderCurrentWeather(current)
    renderDailyWeather(daily)
    document.body.classList.remove("blurred")
}

navigator.geolocation.getCurrentPosition(positionSuccessII, positionErrorII)

function positionSuccessII( {coords}) {
    getWeather(coords.latitude, coords.longitude, Intl.DateTimeFormat().resolvedOptions().timeZone)
    .then(renderWeatherII)
    .catch(v => {
        console.error(v)
        alert("Error getting weather.")
    })
}


function positionErrorII() {
    alert("There was an error getting your location. Please allow us to use your location and refresh the page.")
}

function renderWeatherII({ daily, hourly}) {
    renderHourlyWeather(daily, hourly)
    document.body.classList.remove("blurred")
}

function setValue(selector, value, { parent = document} = {}) {
    parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(iconCode) {
    return `/icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]")

function renderCurrentWeather(current) {
    currentIcon.src = getIconUrl(current.iconCode)
    setValue("current-temp", current.currentTemp),
    setValue("current-high", current.highTemp),
    setValue("current-low", current.lowTemp),
    setValue("current-fl-high", current.highFeelsLike),
    setValue("current-fl-low", current.lowFeelsLike),
    setValue("current-wind", current.windSpeed),
    setValue("current-precip", current.precip)
}


const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long"})
const dailySection = document.querySelector('[data-day-section]')
const dayCardTemplate = document.getElementById('day-card-template')

function renderDailyWeather(daily) {
    if (document.getElementById('main-page')) {
    dailySection.innerHTML = ''
    let idCounter = 0;
    daily.forEach(day => {
        const element = dayCardTemplate.content.cloneNode(true)
        element.querySelector(".day-btn").id = "id" + idCounter++;
        setValue("temp", day.maxTemp, { parent: element })
        setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element })
        element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
        dailySection.append(element)
        setupAnchorTagClickListeners();
    })}
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric"})
const hourlySection = document.querySelector('[data-hour-section]')
const hourRowTemplate = document.getElementById('hour-row-template')

function renderHourlyWeather(daily, hourly) {
    if (document.getElementById('hourly-page')) {
        hourlySection.innerHTML = '';
        const selectedDate = new Date(daily[dI].timestamp);
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        hourly.forEach(hour => {
            const hourDate = new Date(hour.timestamp);

            if (hourDate >= startOfDay && hourDate <= endOfDay) {
                const element = hourRowTemplate.content.cloneNode(true);
                setValue("temp", hour.temp, { parent: element });
                setValue("fl-temp", hour.feelsLike, { parent: element });
                setValue("wind", hour.windSpeed, { parent: element });
                setValue("precip", hour.precip, { parent: element });
                setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element });
                setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element });
                element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
                hourlySection.append(element);
            }
        });
    }
}

function setupAnchorTagClickListeners() {
    const anchorTags = document.querySelectorAll('.day-section .day-btn');

    anchorTags.forEach(anchor => {
        anchor.addEventListener('click', storeClickedAnchorId);
    });
}

function storeClickedAnchorId(event) {

    event.preventDefault();

    const clickedAnchorId = event.currentTarget.id;
    const newUrl = "hourly.html?id=" + clickedAnchorId;
    window.location.href = newUrl;
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const dayId = getQueryParam('id');

const dI = dayId[2]

