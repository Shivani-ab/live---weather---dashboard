import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/WeatherCard.css"; // for forecast styling

// Forecast component (same as your previous one)
const Forecast = ({ city, apiKey }) => {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForecast = async () => {
      if (!city) return;
      try {
        setError("");
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            city
          )}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        if (data.cod === "200" || data.cod === 200) {
          // Filter one entry per day at 12:00
          const dailyData = data.list.filter((item) =>
            item.dt_txt.includes("12:00:00")
          );
          setForecast(dailyData);
        } else {
          setError("Unable to fetch forecast.");
          setForecast([]);
        }
      } catch {
        setError("Unable to fetch forecast.");
        setForecast([]);
      }
    };
    fetchForecast();
  }, [city, apiKey]);

  if (!city) return null;

  return (
    <div className="forecast" style={{ marginTop: "20px" }}>
      <h3>5-Day Forecast</h3>
      {error && <p className="error">{error}</p>}
      <div className="forecast-cards" style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
        {forecast.map((day, index) => (
          <div
            className="forecast-card"
            key={index}
            style={{
              padding: "10px",
              borderRadius: "8px",
              background: "#f0f0f0",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            <p className="date">
              {new Date(day.dt_txt).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="temp">{Math.round(day.main.temp)}°C</p>
            <p className="condition">{day.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Tamil Nadu Weather component
const TamilNaduWeather = () => {
  const tamilNaduCities = [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tirunelveli",
    "Erode",
    "Vellore",
    "Thanjavur",
  ];

  const [city, setCity] = useState("Chennai");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Hardcoded API key
  const apiKey = "9d67dceee71624f22f0daada94abb405";

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      console.log("Weather API response:", data); // Debug
      if (data.cod === 200 || data.cod === "200") {
        setWeather({
          city: data.name,
          temperature: data.main.temp,
          condition: data.weather[0].description,
          lat: data.coord.lat,
          lon: data.coord.lon,
        });
      } else {
        setError("Unable to fetch weather for this city.");
        setWeather(null);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching weather data.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather on city change
  useEffect(() => {
    if (city) fetchWeather(city);
  }, [city]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌤️ Tamil Nadu Live Weather Map</h1>

      {/* City selection */}
      <div style={{ margin: "10px 0" }}>
        <label>Select City: </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ padding: "5px", marginLeft: "10px" }}
        >
          {tamilNaduCities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Status messages */}
      {loading && <p>Loading weather data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Weather info */}
      {weather && (
        <div style={{ marginTop: "20px" }}>
          <h2>{weather.city}</h2>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Condition: {weather.condition}</p>

          {/* Weather map */}
          {typeof weather.lat === "number" && typeof weather.lon === "number" && (
            <div style={{ height: "500px", width: "100%", marginTop: "20px" }}>
              <MapContainer
                center={[weather.lat, weather.lon]}
                zoom={8}
                style={{ height: "100%", width: "100%", borderRadius: "12px" }}
              >
                <TileLayer
                  url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                  attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                />
              </MapContainer>
            </div>
          )}

          {/* 5-day forecast */}
          <Forecast city={weather.city} apiKey={apiKey} />
        </div>
      )}
    </div>
  );
};

export default TamilNaduWeather;
