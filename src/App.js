import React, {useState, useEffect} from 'react';
import './App.css';

import {FormControl,MenuItem, Select, Card, CardContent} from "@material-ui/core"

import InfoBox from './components/InfoBox/InfoBox.component'
import Map from './components/Map/Map.component'
import Table from './components/Table/Table.component'
import LineGraph from './components/LineGraph/LineGraph.component'
import "leaflet/dist/leaflet.css"

import {sortData, prettyPrintStat} from './utils'

// https://disease.sh/v3/covid-19/ 
function App() {

  const worldCenter = {lat: 34.80746, lng: -40.4796}

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState(worldCenter);
  const [mapZoom, setMapZoom] = useState(3)
  const [caseType, setCaseType] = useState("cases")

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
        console.log(sortData(data))
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

      countryCode==='worldwide' ? setMapCenter(worldCenter) : setMapCenter({lat: data.countryInfo.lat, lng: data.countryInfo.long})
      countryCode==='worldwide' ? setMapZoom(3) : setMapZoom(4);
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
          <InfoBox isRed active={caseType==='cases'} onClick={e => setCaseType("cases")} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
          <InfoBox active={caseType==='recovered'} onClick={e => setCaseType("recovered")} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
          <InfoBox isRed active={caseType==='deaths'} onClick={e => setCaseType("deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
        </div>

        {/* Map */}
        <Map caseType={caseType} countries={tableData} center={mapCenter} zoom={mapZoom} />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 style={{marginTop: "20px", marginBottom: "10px"}}>Worldwide New {caseType.toUpperCase()}</h3>
          <LineGraph className="app__graph" caseType={caseType} color={caseType==='cases'? "#CC1034" : (caseType==='recovered' ? "#7dd71d" : "fb4443")} />
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
