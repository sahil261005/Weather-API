// API Configuration
const API_KEY = config.API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.querySelector('.weather-info');
const errorMessage = document.getElementById('error-message');
const cityElement = document.getElementById('city');
const tempElement = document.getElementById('temp');
const weatherIcon = document.getElementById('weather-icon');
const condition = document.getElementById('condition');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Main search handler
async function handleSearch() {
    const city = searchInput.value.trim().toLowerCase();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeatherInfo(weatherData);
        hideError();
        
        // Properly capitalize the city name in the input field
        searchInput.value = city.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    } catch (error) {
        console.error('Error:', error);
        showError('City not found or network error. Please try again.');
    }
}

// Fetch weather data from API
async function fetchWeatherData(city) {
    try {
        const response = await fetch(
            `${BASE_URL}?q=${encodeURIComponent(city)},IN&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.message || 'Weather data not found');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

// Display weather information
function displayWeatherInfo(data) {
    weatherInfo.classList.remove('hidden');
    
    // Update DOM elements with weather data
    cityElement.textContent = data.name;
    tempElement.textContent = `${Math.round(data.main.temp)}°C`;
    condition.textContent = data.weather[0].description
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`; // Convert m/s to km/h
    
    // Add fade-in animation
    weatherInfo.style.opacity = '0';
    weatherInfo.style.transform = 'translateY(20px)';
    weatherInfo.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
    
    // Force reflow
    weatherInfo.offsetHeight;
    
    // Show the element
    weatherInfo.style.opacity = '1';
    weatherInfo.style.transform = 'translateY(0)';
}

// Error handling functions
function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// Initial setup
searchInput.focus(); // Focus on search input when page loads

// Add this to show a welcome message
function showWelcomeMessage() {
    const weatherContainer = document.querySelector('.weather-container');
    if (!weatherContainer.querySelector('.welcome-message')) {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'welcome-message';
        welcomeDiv.style.color = '#fff';
        welcomeDiv.style.fontSize = '1.2em';
        welcomeDiv.style.padding = '20px';
        welcomeDiv.innerHTML = 'Enter an Indian city name above to see the weather! <i class="fas fa-arrow-up"></i>';
        weatherContainer.appendChild(welcomeDiv);
    }
}

// Call it when the page loads
showWelcomeMessage(); 