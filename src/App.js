import React, {useState, useEffect} from 'react';
import './App.css';

import {FormControl,MenuItem, Select, Card, CardContent} from "@material-ui/core"

import InfoBox from './components/InfoBox/InfoBox.component'
import Map from './components/Map/Map.component'
import Table from './components/Table/Table.component'
import LineGraph from './components/LineGraph/LineGraph.component'
import "leaflet/dist/leaflet.css"

import {sortData} from './utils'

// https://disease.sh/v3/covid-19/ 
function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3)

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then (response => response.json())
    .then (data => setCountryInfo(data))
  }, [])

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
        setTableData(sortData(data));
        setCountries(countries);
      })
    }
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    // https://disease.sh/v3/covid-19/countries/{countryCode}
    // https://disease.sh/v3/covid-19/all

    const url = countryCode==='worldwide' ? 
                'https://disease.sh/v3/covid-19/all' :
                `https://disease.sh/v3/covid-19/countries/${countryCode}`
    
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter({lat: data.countryInfo.lat, lng: data.countryInfo.long})
      setMapZoom(4);
    })
  }

  return (
    <div className="app">

      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown" >
            <Select
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* Loop through all the countries and show a dropdown */}
              {
                countries.map(country => (
                  <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
                ))
              }

            </Select>
          </FormControl>
        </div>


        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>

        {/* Map */}
        <Map center={mapCenter} zoom={mapZoom} />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide New Cases</h3>
          <LineGraph />
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
