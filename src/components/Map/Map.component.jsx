import React from 'react';
import {Map as LeafletMap, TileLayer} from 'react-leaflet'

import './Map.css'

import {showDataOnMap} from '../../utils'

const Map = ({countries, center, zoom, caseType}) => {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
            />
            {showDataOnMap(countries, caseType)}
            </LeafletMap>
        </div>
    )
}

export default Map;