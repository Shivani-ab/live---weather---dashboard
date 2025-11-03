import React from "react";
import "../styles/WeatherCard.css";

// Supports two usages:
// 1) <WeatherCard weather={weather} onShowForecast={fn} />
// 2) <WeatherCard city="..." temperature={...} condition="..." onShowForecast={fn} />
const WeatherCard = ({ weather, city, temperature, condition, onShowForecast }) => {
  // If neither weather nor minimal props provided, render nothing
  const hasMinimal = city !== undefined && temperature !== undefined && condition !== undefined;
  if (!weather && !hasMinimal) return null;

  // Prefer full `weather` object when present
  const displayCity = weather ? weather.name : city;
  const displayTemp = weather ? Math.round(weather.main.temp) : temperature;
  const displayCondition = weather ? weather.weather[0].description : condition;

  return (
    <div className="weather-card">
      <h2>{displayCity}{weather && weather.sys && weather.sys.country ? `, ${weather.sys.country}` : ""}</h2>
      <p className="temperature">{displayTemp}°C</p>
      <p className="condition">{displayCondition}</p>

      {weather && (
        <div className="details">
          <p>🌡️ Feels like: {Math.round(weather.main.feels_like)}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬️ Wind: {weather.wind.speed} m/s</p>
        </div>
      )}

      <div className="card-actions">
        <button
          className="forecast-button"
          onClick={() => onShowForecast && onShowForecast(displayCity)}
        >
          View Forecast
        </button>
      </div>
    </div>
  );
};

export default WeatherCard;
