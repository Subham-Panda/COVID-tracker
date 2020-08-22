import React from 'react';
import {Map as LeafletMap, TileLayer} from 'react-leaflet'

import './Map.css'

const Map = ({center, zoom}) => {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
            />

            {/* Loop thorugh and make circles for all countries */}
            </LeafletMap>
        </div>
    )
}

export default Map;