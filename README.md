# Weather App
Build a React web app that displays the current 5-day weather forecast.

## Core requirements
1 React web app that runs locally in a browser.
2 Use the OpenWeatherMap 5-day forecast API: http://openweathermap.org/forecast5
3 Support geolocation to retrieve the user’s current position and load forecast.
4 Support city search to retrieve a 5-day forecast for a user-specified city.
5 Display a readable 5-day forecast with relevant daily information.
6 Ability to drill into hourly details for a selected day.
7 Clear, readable interface; no need for polished or flashy UI.
8 You may use any libraries, frameworks, build tools, or component systems you find appropriate.
9 Include unit tests for the most important parts of the application.

## Setup
1 Create a `.env` file in the project root with `VITE_OPENWEATHER_API_KEY=YOUR_KEY`.
2 Install dependencies with `npm install`.
3 Start the app with `npm run dev`.

## Usage
- On load, the app requests your current location and fills the search box with the detected city name.
- Search by city name or use "Use my location" to load the 5-day forecast.
- Select a day card to drill into 3-hour intervals for that day.
- On smaller screens, the hourly details open in a modal overlay; closing it keeps the day selected so details reappear on larger screens.

## Tests
- Run `npm test`.
