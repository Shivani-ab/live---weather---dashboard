import React, { useState, useMemo } from "react";
import "../styles/SearchBar.css";
import TAMILNADU_CITIES from "../data/tamilnadu_cities";

const SearchBar = ({ onSearch, onLocate }) => {
  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const suggestions = useMemo(() => {
    if (!city) return [];
    const q = city.toLowerCase();
    return TAMILNADU_CITIES.filter((c) => c.toLowerCase().startsWith(q)).slice(0, 8);
  }, [city]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      onSearch(city);
      setCity("");
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setLocating(false);
        onLocate && onLocate(lat, lon);
      },
      (err) => {
        setLocating(false);
        alert("Unable to access location. Please allow location access and try again.");
      },
      { timeout: 8000 }
    );
  };

  const handleSelectSuggestion = (name) => {
    onSearch(name);
    setCity("");
    setShowAll(false);
  };

  const toggleShowAll = () => {
    setShowAll((s) => !s);
  };

  return (
    <div>
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">
        Search
      </button>
      <button type="button" className="locate-button" onClick={handleLocate} disabled={locating}>
        {locating ? "Locating..." : "Use my location"}
      </button>
      <button type="button" className="tn-button" onClick={toggleShowAll}>
        {showAll ? "Hide TN cities" : "All TN cities"}
      </button>
    </form>

    {/* Suggestions dropdown */}
    {suggestions.length > 0 && (
      <ul className="suggestions-list">
        {suggestions.map((s) => (
          <li key={s} onClick={() => handleSelectSuggestion(s)} className="suggestion-item">{s}</li>
        ))}
      </ul>
    )}

    {/* All TamilNadu cities panel */}
    {showAll && (
      <div className="tn-panel">
        <h4>Tamil Nadu Cities</h4>
        <div className="tn-grid">
          {TAMILNADU_CITIES.map((c) => (
            <button key={c} className="tn-city" onClick={() => handleSelectSuggestion(c)}>{c}</button>
          ))}
        </div>
      </div>
    )}
    </div>
  );
};

export default SearchBar;
