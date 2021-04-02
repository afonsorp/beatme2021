import React, {
  useState, useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  MapContainer, TileLayer, useMapEvents, Marker,
} from 'react-leaflet';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';

const provider = new OpenStreetMapProvider();

const searchControl = new GeoSearchControl({
  provider,
  style: 'bar',
  showMarker: false,
  resultFormat: ({ result }) => {
    console.log({ result });

    return result.label;
  },
});

const MapConfig = ({ location, setLocation }) => {
  const [center, setCenter] = useState({
    lat: location.lat || 38.774,
    lng: location.lng || -9.184,
  });
  const map = useRef();

  const formatAndSetLocation = useCallback((loc) => {
    const formatLoc = {
      lat: loc.lat.toFixed(5),
      lng: loc.lng.toFixed(5),
    };
    setLocation(formatLoc);
  }, [setLocation]);

  const LocationMarker = () => {
    map.current = useMapEvents({
      click: (e) => {
        setCenter(e.latlng);
        formatAndSetLocation(e.latlng);
        map.current.locate();
      },
    });
    const myIcon = L.icon({
      iconUrl: 'pin.png',
      iconSize: [26, 35],
      iconAnchor: [13, 35],
    });
    return center === null ? null : (
      <Marker position={center} icon={myIcon} />
    );
  };

  const moveInMap = useCallback((position) => {
    setCenter(position);
    map.current.flyTo(position, 17);
    map.current.locate();
  }, [map]);

  const findPosition = useCallback(() => {
    if (location.lat && location.lng) {
      moveInMap(location);
    } else {
      navigator.geolocation.getCurrentPosition((loc) => {
        const { latitude: lat, longitude: lng } = loc.coords;
        const nPosition = {
          lat,
          lng,
        };
        formatAndSetLocation(nPosition);
        moveInMap(nPosition);
      }, (err) => console.error({ err }));
    }
  }, [location, moveInMap, formatAndSetLocation]);

  if (map.current) map.current.addControl(searchControl);

  return (
    <MapContainer
      center={center}
      zoom={6}
      scrollWheelZoom={false}
      whenCreated={findPosition}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
};

MapConfig.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    lng: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  setLocation: PropTypes.func.isRequired,
};

//   MapConfig.defaultProps = {
//     isPlayer: false,
//   };

export default MapConfig;
