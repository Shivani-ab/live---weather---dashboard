// Configuration file for Weather Dashboard

// Base URL for OpenWeatherMap API
export const BASE_URL = "https://api.openweathermap.org/data/2.5";

// API key (loaded from .env file)
// Prefer the environment variable; fall back to a literal if it's not provided.
// Note: storing secrets in source code is not recommended for production.
export const API_KEY = process.env.REACT_APP_API_KEY || "9d67dceee71624f22f0daada94abb405";
