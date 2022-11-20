import "./App.css";
import { useRef, useEffect, useState } from "react";
import wind from "./image/wind.png";
import humidity from "./image/humidity.png";
import pressure from "./image/pressure.png";
import OtherElement from "./component/otherElement";

const API_KEY = "3b807b3838d01926bb318d22aa783f04",
  BASE_URL = `https://api.openweathermap.org/data/2.5/weather`,
  WEATHERICON = "http://openweathermap.org/img/wn/{iconId}@2x.png";

let sNew;
function App() {
  const [weatherIcon, setWeatherIcon] = useState(
      "http://openweathermap.org/img/wn/01d@2x.png"
    ),
    [todaysTemp, setTodaysTemp] = useState(0),
    [todaysMinTemp, setTodaysMinTemp] = useState(0),
    [todaysMaxTemp, setTodaysMaxTemp] = useState(0),
    [description, setDescription] = useState(""),
    [windUnit, setWindUnit] = useState(""),
    [humidityUnit, setHumidityUnit] = useState(""),
    [pressureUnit, setPressureUnit] = useState(""),
    [newData, setNewData] = useState(false),
    inputRef = useRef(null),
    handleInputLiveChange = (oEvent) => {
      oEvent.target.style.width =
        (oEvent.target.value.length < 10 ? 11 : oEvent.target.value.length) +
        "ch";
      if (sNew) {
        clearInterval(sNew);
      }
      sNew = setTimeout(() => {
        setNewData(!newData);
      }, 2000);
    };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude,
        long = position.coords.longitude,
        url = `${BASE_URL}?${
          `q=${inputRef.current.value}` || `lat=${lat}&lon=${long}`
        }&appid=${API_KEY}&units=metric`;

      fetch(url)
        .then((oResponse) => {
          if (oResponse.status !== 200) {
            throw new Error(`${oResponse.status} ${oResponse.statusText}`);
          }
          return oResponse.json();
        })
        .then((oResponse) => {
          console.log(
            oResponse,
            new Date((oResponse.sys.sunrise + oResponse.timezone) * 1000)
          );
          let oWeather = oResponse.weather[0];
          inputRef.current.value = oResponse.name;
          inputRef.current.style.width =
            (oResponse.name.length < 10 ? 11 : oResponse.name.length) + "ch";
          setWeatherIcon(WEATHERICON.replace("{iconId}", oWeather.icon));
          setDescription(oWeather.description);
          setTodaysTemp(Math.round(oResponse.main.temp));
          setTodaysMaxTemp(Math.round(oResponse.main.temp_max));
          setTodaysMinTemp(Math.round(oResponse.main.temp_min));
          setWindUnit(Math.round(oResponse.wind.speed) + "m/s");
          setHumidityUnit(oResponse.main.humidity + "%");
          setPressureUnit(oResponse.main.pressure + "hPa");
        })
        .catch((eResponse) => {
          console.log(eResponse);
        });
    });
  }, [newData]);

  return (
    <div className="App">
      <div className="App__SeachSection">
        Right now in &nbsp;
        <input
          onInput={handleInputLiveChange}
          type="text"
          ref={inputRef}
        ></input>
        , it's {description}
      </div>
      <div className="App__TodaysTemp">
        <img width={150} height={150} src={weatherIcon} alt="Weather Icon" />
        <div className="App__TodaysTemp__Number">
          <p>{todaysTemp} °C</p>
          <span>
            {todaysMinTemp} °C / {todaysMaxTemp} °C
          </span>
        </div>
        <div className="App__TodaysTemp_Other">
          <OtherElement icon={wind} unit={windUnit} />
          <OtherElement icon={humidity} unit={humidityUnit} />
          <OtherElement icon={pressure} unit={pressureUnit} />
        </div>
      </div>
    </div>
  );
}

export default App;
