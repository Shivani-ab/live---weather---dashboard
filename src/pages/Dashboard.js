import React, { useState, useEffect, useRef, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
import {
  getCurrentWeather,
  getWeatherByCoords,
} from "../api/weatherApi";
import "../styles/App.css";

const REFRESH_INTERVAL_MS = 30_000; // 30 seconds

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [view, setView] = useState("current"); // 'current' or 'forecast'
  const [loading, setLoading] = useState(false);
  const liveTimerRef = useRef(null);
  const lastQueryRef = useRef(null); // stores last city or coords

  const fetchByCity = useCallback(async (city) => {
    setLoading(true);
    try {
      setError("");
      const data = await getCurrentWeather(city);
      setWeather(data);
      lastQueryRef.current = { type: "city", value: city };
    } catch (e) {
      setError("City not found. Try again!");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    try {
      setError("");
      const data = await getWeatherByCoords(lat, lon);
      setWeather(data);
      lastQueryRef.current = { type: "coords", value: { lat, lon } };
    } catch (e) {
      setError("Unable to fetch weather for your location.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async (city) => {
    await fetchByCity(city);
  };

  const handleShowForecast = (cityName) => {
    // Ensure we have a city (from weather or the passed name)
    if (!cityName && weather) cityName = weather.name;
    setView("forecast");
  };

  // Geolocation on mount: try to get user's location and load weather
  useEffect(() => {
    if (!navigator.geolocation) return;

    const onSuccess = (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      fetchByCoords(lat, lon);
    };

    const onError = () => {
      // silently ignore; user can search manually
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      maximumAge: 5 * 60 * 1000,
      timeout: 5_000,
    });
  }, [fetchByCoords]);

  // Live refresh handler
  useEffect(() => {
    // Clear any existing timer
    if (liveTimerRef.current) {
      clearInterval(liveTimerRef.current);
      liveTimerRef.current = null;
    }

    if (!isLive) return;

    // Set interval to refresh lastQueryRef
    liveTimerRef.current = setInterval(async () => {
      const last = lastQueryRef.current;
      if (!last) return;
      if (last.type === "city") {
        await fetchByCity(last.value);
      } else if (last.type === "coords") {
        const { lat, lon } = last.value;
        await fetchByCoords(lat, lon);
      }
    }, REFRESH_INTERVAL_MS);

    return () => {
      if (liveTimerRef.current) clearInterval(liveTimerRef.current);
      liveTimerRef.current = null;
    };
  }, [isLive, fetchByCity, fetchByCoords]);

  const handleRefreshClick = async () => {
    const last = lastQueryRef.current;
    if (!last) return;
    if (last.type === "city") await fetchByCity(last.value);
    else if (last.type === "coords") {
      const { lat, lon } = last.value;
      await fetchByCoords(lat, lon);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="title">🌤️ Live Weather</h1>
        <div className="controls">
          <label className="live-toggle">
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
            />
            Live
          </label>
          <button className="refresh-button" onClick={handleRefreshClick}>
            Refresh
          </button>
        </div>
      </div>

  <SearchBar onSearch={handleSearch} onLocate={(lat, lon) => fetchByCoords(lat, lon)} />
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {view === "current" && (
        <WeatherCard weather={weather} onShowForecast={handleShowForecast} />
      )}

      {view === "forecast" && (
        <div className="forecast-view">
          <button className="back-button" onClick={() => setView("current")}>
            ← Back
          </button>
          {weather ? (
            <Forecast city={weather.name} />
          ) : (
            <p className="info">No city selected for forecast.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
