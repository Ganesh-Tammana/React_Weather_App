import React, { useState, useEffect ,lazy, Suspense} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Strom from './assets/strom.svg'
import Fog from './assets/fog.svg'
import Rain from './assets/rain.svg'
import Sun from './assets/sun1.svg'
import Clouds from './assets/clouds.svg'
import Snow from './assets/snow.svg'
import Sleet from './assets/sleet.svg'
import Wind from './assets/wind.svg'
import Mist from './assets/mist.svg'
import Vector from './assets/vector.jpg'
import Nature from './assets/waterfall.jpg'
import BG from './assets/nature2.jpg'
import {faSearch,faTemperature4,faTemperatureHigh,faTint,faWind,faMapMarker,faFlag} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
const Card = lazy(() => import('./cards'));
const API_KEY = import.meta.env.VITE_API_KEY;

const App = () => {
  
  const dateBulider=(d)=>{
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    let day=days[d.getDay()];
    let date=d.getDate();
    let month=months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`
  }
 
  
  const[currentTime,SetTime]=useState(new Date());
  const [city, setCity] = useState('');
  const [wdata, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(()=>{
    const time =setInterval(()=>{
      SetTime(new Date())
    },1000);

    return () => clearInterval(time);
  },[])

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( 
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
            .then((res) => {
              setData(res.data);
            })
            .catch((err) => {
              alert(`Error getting weather data: ${err.message}`);
              setData(null);
            })
            .finally(() => {
              setLoading(false);
            });
          },
          (error) => {
            setLoading(false);
            alert(`Error getting location: ${error.message}`);
          }
      );
    } else {
      setLoading(false);
      alert('Geolocation is not supported by your browser. Please enter a city manually.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (city !== '') {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        setData(response.data);
      } catch (err) {
        alert(`Error getting weather data: ${err.message}`);
        setData(null);
        setCity('');
        getCurrentLocation();
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Fetching weather data based on geolocation...');
      getCurrentLocation();
    }
  };
  

  const handleInputChange = (e) => {
    const inputValue=e.target.value;
    setCity(inputValue);
    if (!inputValue.trim()) {   getCurrentLocation(); }
  };
  const cards = [
    {
      title: 'Temperature',
      icon: faTemperature4,
      color: 'emerald',
      value: wdata?.main?.temp !== undefined ? (wdata.main.temp >= -100 && wdata.main.temp <= 100 ? wdata.main.temp.toFixed(2)
        : (wdata.main.temp - 273.15).toFixed(2)) : '',
      symbol:'°C'
    },
    {
      title: 'Feels Like',
      icon: faTemperatureHigh,
      color: 'orange',
      value: wdata?.main?.temp !== undefined ? (wdata.main.temp >= -100 && wdata.main.temp <= 100 ? wdata.main.temp.toFixed(2)
      : (wdata.main.temp - 273.15).toFixed(2)) : '',
      symbol:'°C'
    },
    {
      title: 'Humidity',
      icon: faTint,
      color: 'sky',
      value: wdata?.main?.humidity,
      symbol:'%'
    },
    {
      title: 'Wind Speed',
      icon: faWind,
      color: 'gray',
      value: wdata?.wind?.speed,
      symbol:'km/h'
    },
    {
      title: 'Country',
      icon: faFlag,
      color: 'green',
      value: wdata && wdata.sys && wdata.sys.country ? wdata.sys.country : '',
      symbol:''
    },
    {
      title: 'Location',
      icon: faMapMarker,
      color: 'pink',
      value: wdata && wdata.main ? `${wdata.name} ` : '',
      symbol:''
    },
  ];
  
  const BgIcons={'haze':Sun,'rain':Rain,'sun':Strom,'wind':Wind,'fog':Fog,'clouds':Clouds,'snow':Snow,
  'drizzle':Sleet,'dust':Wind,'smoke':Fog,'tornado':Wind,'mist':Mist}
  
  const Icons = (value) => {
    switch (value) {
      case "Haze":
          return BgIcons.haze;
      case "Clouds":
        return BgIcons.clouds;
      case "Rain":
        return BgIcons.rain;
      case "Snow":
        return BgIcons.snow;
      case "Dust":
        return BgIcons.wind;
      case "Drizzle":
        return BgIcons.drizzle;
      case "Fog":
        return BgIcons.fog;
      case "Smoke":
        return BgIcons.smoke;
      case "Tornado":
        return BgIcons.tornado;
      case "Mist":
        return BgIcons.mist;
      default:
        return BgIcons.haze;
    }
  };
  
  
  const Bgimg = wdata && wdata.weather && wdata.weather.length > 0 && wdata.weather[0].main ? Icons(wdata.weather[0].main) :  BgIcons.tornado;
  
  return (
    <div className='w-full h-screen md:flex md:justify-center md:items-center lg:flex  justify-center items-center font-sans  bg-cover bg-bottom ' style={{backgroundImage:`url(${BG})`}}>

      <div className='md:flex md:justify-center md:items-center  flex-row md:flex-row justify-center items-center shadow-2xl  lg:h-4/6 lg:w-[calc(800px)] md:h-[calc(500px)] md:w-[calc(700px)]'> 

     
        
        <div className='w-full h-1/2  md:w-1/2 md:h-full lg:w-1/2 lg:h-full p-2  rounded  text-zinc-700 font-bold md:rounded-tl-lg md:rounded-bl-lg lg:rounded-tl-lg lg:rounded-bl-lg flex flex-col justify-between  bg-cover bg-center' style={{backgroundImage:`url(${Vector})`}} >
          
          <div className='flex flex-col items-end lg:px-5 md:px-4 font-sans   font-extrabold '>
            {wdata && <h1 className='border-b-2 border-gray-300 text-3xl'>{wdata.name}</h1>}
            {wdata && wdata.main && (<h1 className='text-2xl'>{wdata.main.temp >= -100 && wdata.main.temp <= 100 ? wdata.main.temp.toFixed(2): (wdata.main.temp - 273.15).toFixed(2)} °C</h1>)}
          </div>

          <div className='flex justify-center flex-col  items-center '>
            <div className='bg-cover bg-center w-36 h-36' style={{backgroundImage:`url(${Nature})`}}></div>
            {wdata &&  wdata.main && (<h1 className='text-xl'>{wdata.weather[0].main}</h1>)}
          </div>


          <div className='font-sans px-5 text-xl  font-extrabold'>
            <h1>{currentTime.toLocaleTimeString()}</h1>
            <h1>{dateBulider(new Date())}</h1>
          </div>
          
        </div> 
        
        
        <div className='w-full h-1/2  md:w-1/2 md:h-full lg:w-1/2 lg:h-full flex justify-center  items-center lg:rounded-tr-lg lg:rounded-br-lg   bg-cover bg-center bg-opacity-90 backdrop-filter backdrop-blur py-2 px-1' style={{backgroundImage:`linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.2)),url(${Nature})`}}>
            
        { 
          loading ? (
              <div className='flex items-center justify-center h-[calc(100vh-60px)] '>
                  <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" className='animate-spin' viewBox="0 0 512 512"><path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" /></svg>
              </div>
          ) :
            <form onSubmit={handleSubmit}  className='flex flex-col lg:gap-8 md:gap-12 items-center justify-center  '>
              <h2 className='font-extrabold text-4xl text-white/80 tracking-wider'>Weather Info</h2>
              <div className='flex  md:justify-evenly w-full lg:justify-around p-1 gap-4 '>
                <input
                  type='text'
                  value={city}
                  onChange={handleInputChange}
                  placeholder='Enter Your City'
                  className='lg:border-b-2 lg:border-inherit outline-none p-1.5 rounded font-sans w-full'
                />
                <button className='p-1 text-fuchsia-50 rounded text-lg bg-blue-600 outline-none font-bold flex justify-center items-center'>
                  <FontAwesomeIcon icon={faSearch} className='text-base'/><h1>Search</h1>
                </button>
              </div>
              
              
              
                <div>
                  {wdata && wdata.main && (

                    <div className="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-4 p-2  font-sans ">
                      <Suspense fallback={<div>Loading card...</div>}>
                      {cards.map((cardd, index) => (
                        <Card key={index} {...cardd} />
                      ))}
                    </Suspense>

                    </div>
                  )}
                </div>
                 
            </form>
        }
          </div>
        </div>
    </div>
  );
};

export default App;



