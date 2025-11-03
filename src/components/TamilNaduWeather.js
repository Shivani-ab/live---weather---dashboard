import React, { useEffect, useState } from "react";
import TAMILNADU_CITIES from "../data/tamilnadu_cities";
import { getCurrentWeather } from "../api/weatherApi";
import WeatherCard from "./WeatherCard";

const TamilNaduWeather = () => {
  const [city, setCity] = useState(TAMILNADU_CITIES[0] || "Chennai");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetch = async (c) => {
    setLoading(true);
    setError("");
    try {
      const data = await getCurrentWeather(c);
      setWeather(data);
    } catch (e) {
      setError("Unable to load weather for " + c);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) fetch(city);
  }, [city]);

  return (
    <div style={{ padding: 20, maxWidth: 860, margin: "0 auto" }}>
      <h2>Tamil Nadu — City Weather</h2>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          {TAMILNADU_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button onClick={() => fetch(city)} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <WeatherCard weather={weather} />
    </div>
  );
};

export default TamilNaduWeather;
