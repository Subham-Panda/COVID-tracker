import React, {useState, useEffect} from 'react';
import './App.css';

import {FormControl,MenuItem, Select} from "@material-ui/core"

import InfoBox from './components/InfoBox/InfoBox.component' 

// https://disease.sh/v3/covid-19/ 
function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, //United States, United Kingdom
            value: country.countryInfo.iso2 //USA, UK
          }
        ))
        setCountries(countries);
      })
    }
    getCountriesData();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
  }

  return (
    <div className="app">
      <div className="app__header">
      <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown" >
          <Select
            variant="outlined"
            value={country}
            onChange={onCountryChange}
          >
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {/* Loop through all the countries and show a dropdown */}
            {
              countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }

          </Select>
        </FormControl>
      </div>


      <div className="app__stats">
        <InfoBox title="Coronavirus Cases" cases={1} total={1}/>
        <InfoBox title="Recovered" cases={1} total={1}/>
        <InfoBox title="Deaths" cases={1} total={1}/>
      </div>

      {/* Table */}
      {/* Graph*/}

      {/* Map */}
    </div>
  );
}

export default App;