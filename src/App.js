import './App.css';
import { useRef, useEffect, useState } from 'react';

const API_KEY = '3b807b3838d01926bb318d22aa783f04',
  BASE_URL = `https://api.openweathermap.org/data/2.5/weather`,
  WEATHERICON = 'http://openweathermap.org/img/wn/{iconId}@2x.png';

function App() {

  const [weatherIcon, setWeatherIcon] = useState(""),
    [todaysTemp, setTodaysTemp] = useState(58),
    inputRef = useRef(null);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude,
        long = position.coords.longitude,
        url = `${BASE_URL}?lat=${lat}&lon=${long}&appid=${API_KEY}`;

      fetch(url).then((oResponse) => {
        if (oResponse.status !== 200) {
          throw new Error(`${oResponse.status} ${oResponse.statusText}`)
        }
        return oResponse.json();
      }).then((oResponse) => {
        console.log(oResponse);
        inputRef.current.value = oResponse.name;
        setWeatherIcon(WEATHERICON.replace("{iconId}", oResponse.weather[0].icon))
      }).catch((eResponse) => console.log(eResponse));
    });
  }, []);

  return (
    <div className="App">
      <div className="App__SeachSection">
        Right now in <input ref={inputRef}></input>, it's clear
      </div>
      <div className="App__TemperatureSection">
        <img src={weatherIcon} alt="Sunny Day" />
        <h1>{todaysTemp}</h1>
      </div>
    </div>
  );
}

export default App;
