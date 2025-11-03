import React, { useEffect, useState } from "react";
import { getForecast } from "../api/weatherApi";
import "../styles/WeatherCard.css"; // reuse styling or make Forecast.css

const Forecast = ({ city }) => {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForecast = async () => {
      if (!city) return;
      try {
        setError("");
        const data = await getForecast(city);

        // Group data by date (only pick one entry per day, e.g., 12:00)
        const dailyData = data.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );
        setForecast(dailyData);
      } catch {
        setError("Unable to fetch forecast.");
        setForecast([]);
      }
    };

    fetchForecast();
  }, [city]);

  if (!city) return null;

  return (
    <div className="forecast">
      <h3>5-Day Forecast</h3>
      {error && <p className="error">{error}</p>}
      <div className="forecast-cards">
        {forecast.map((day, index) => (
          <div className="forecast-card" key={index}>
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

export default Forecast;
