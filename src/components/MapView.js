import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Renders a full-height map with pins for each place
export default function MapView({ center, places = [] }) {
  // Determine map center: use geocoded center or fallback to first place
  const mapCenter = center || (
    places.length > 0
      ? {
          lat: places[0].geometry.location.lat,
          lng: places[0].geometry.location.lng
        }
      : null
  );

  if (!mapCenter) {
    return (
      <div className="bg-white rounded shadow p-4 h-full flex items-center justify-center text-gray-600">
        Map (waiting for location)
      </div>
    );
  }

  const containerStyle = {
    width: '100%',
    height: '100%',   // fill its parent container
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={13}
      >
        {Array.isArray(places) && places.map(place => (
          <Marker
            key={place.place_id}
            position={{
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng
            }}
            title={place.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}