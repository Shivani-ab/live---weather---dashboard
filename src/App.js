import React, { useState } from "react";
import "./styles/App.css";
import logo from "./logo.svg";

import Dashboard from "./pages/Dashboard";
import Forecast from "./components/Forecast";
import WeatherCard from "./components/WeatherCard";
import SearchBar from "./components/SearchBar";
import WeatherDashboard from "./components/WeatherDashboard";

function App() {
  const [view, setView] = useState("dashboard");

  // Mock weather for previewing components
  const mockWeather = {
    name: "San Francisco",
    sys: { country: "US" },
    main: { temp: 18.5, feels_like: 17.2, humidity: 72 },
    weather: [{ description: "light drizzle" }],
    wind: { speed: 3.5 },
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="Weather logo" />
        <h1 className="app-title">Weather Dashboard</h1>

        <nav className="app-nav" role="navigation" aria-label="Main navigation">
          <button className={view === "dashboard" ? "nav-btn active" : "nav-btn"} onClick={() => setView("dashboard")}>Dashboard</button>
          <button className={view === "forecast" ? "nav-btn active" : "nav-btn"} onClick={() => setView("forecast")}>Forecast</button>
          <button className={view === "weathercard" ? "nav-btn active" : "nav-btn"} onClick={() => setView("weathercard")}>WeatherCard</button>
          <button className={view === "searchbar" ? "nav-btn active" : "nav-btn"} onClick={() => setView("searchbar")}>SearchBar</button>
          <button className={view === "weatherdashboard" ? "nav-btn active" : "nav-btn"} onClick={() => setView("weatherdashboard")}>Weather Dashboard</button>
        </nav>
      </header>

      <main className="app-main">
        {view === "dashboard" && <Dashboard />}

        {view === "forecast" && (
          <div className="page preview">
            <h2>Forecast Preview</h2>
            <Forecast city={mockWeather.name} />
          </div>
        )}

        {view === "weathercard" && (
          <div className="page preview">
            <h2>WeatherCard Preview</h2>
            <WeatherCard weather={mockWeather} onShowForecast={() => setView("forecast")} />
          </div>
        )}

        {view === "searchbar" && (
          <div className="page preview">
            <h2>SearchBar Preview</h2>
            <SearchBar onSearch={(city) => { alert(`Search: ${city}`); setView("dashboard"); }} />
          </div>
        )}

        {view === "weatherdashboard" && (
          <div className="page preview">
            <h2>Weather Dashboard</h2>
            <WeatherDashboard />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
