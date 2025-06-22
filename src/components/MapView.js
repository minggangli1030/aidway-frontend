import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// Renders a full-height map with pins for each place
export default function MapView({ center, places = [], selectedPlaceId, onSelect }) {
  const [infoWindowPlace, setInfoWindowPlace] = React.useState(null);
  
  // Function to open Google Maps directions
  const openGoogleMapsDirections = (place) => {
    // Create Google Maps URL with place name and address
    const destination = encodeURIComponent(`${place.name}, ${place.address}`);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${place.place_id}`;
    
    // Open in new window/tab
    window.open(googleMapsUrl, '_blank');
  };

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
            onClick={() => {
              onSelect(place.place_id);
              setInfoWindowPlace(place);
            }}
            onDblClick={() => openGoogleMapsDirections(place)}
            animation={
              (typeof window !== 'undefined' &&
               window.google &&
               window.google.maps &&
               window.google.maps.Animation &&
               place.place_id === selectedPlaceId)
                ? window.google.maps.Animation.BOUNCE
                : undefined
            }
            icon={
              place.place_id === selectedPlaceId
                ? { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }
                : undefined
            }
          />
        ))}
        
        {infoWindowPlace && (
          <InfoWindow
            position={{
              lat: infoWindowPlace.geometry.location.lat,
              lng: infoWindowPlace.geometry.location.lng
            }}
            onCloseClick={() => setInfoWindowPlace(null)}
          >
            <div className="p-2">
              <h3 className="font-bold">{infoWindowPlace.name}</h3>
              <p className="text-sm">{infoWindowPlace.address}</p>
              <button
                onClick={() => openGoogleMapsDirections(infoWindowPlace)}
                className="mt-2 text-blue-500 hover:text-blue-700 text-sm underline"
              >
                📍 Get Directions
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}