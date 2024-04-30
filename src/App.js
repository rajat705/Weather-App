import React, { useState, useEffect } from 'react';
import './App.css';

import ErrorComp from "./comps/ErrorMessage"
import LeftContainer from './comps/LeftContainer';
import RightContainer from './comps/RightContainer';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [cityName, setCityName] = useState("Gurugram");
  const [showError, setShowError] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const apiKey = '67a89b344f26062bd0efba5141bebf27'; // Define apiKey here

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchWeatherData = async (city) => {
    try {
      setCityName(city);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      const data = await response.json();

      if (data.cod === 200) {
        setWeatherData(data);
        setShowError(false)
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError('City not found!');
        setShowError(true)
      }
    } catch (error) {
      setError('Error fetching weather data ...');
      setShowError(true)
    }
  };

  useEffect(() => {
    const fetchWeatherByGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
              .then((response) => response.json())
              .then((data) => {
                setCityName(data.name);
              })
              .catch((error) => {
                console.error('Error getting location: ' + error.message);
                setCityName("Gurugram");
              });
          },
          // (error) => {
          //   console.error('Error getting location: ' + error.message);
          //   setCityName("Gurugram");
          // }
        );
      } else {
        setCityName("Gurugram");
      }
    };

    fetchWeatherByGeolocation();
  }, [apiKey]);

  useEffect(() => {
    fetchWeatherData(cityName);
  }, [cityName]);

  
  return (
    <div className="App">
      {weatherData && (
        <div className="container">
          <LeftContainer fetchWeatherData={fetchWeatherData} weatherData={weatherData} screenWidth={screenWidth} />
          <RightContainer fetchWeatherData={fetchWeatherData} weatherData={weatherData} screenWidth={screenWidth} cityName={cityName} />
        </div>
      )}
      {
        showError && (
          <ErrorComp message={error} onClose={() => setShowError(false)} />
        )
      }

      <footer className="footer">
         <p> &copy; 2024 Developed by Rajat Nagar &#10084; </p>
      </footer>
    </div>
    
  );
}

export default App;
