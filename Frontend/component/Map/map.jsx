import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ address, city, country, pincode }) => {
  const [coordinates, setCoordinates] = useState(null); 
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const getCoordinates = async () => {
      if (!address || !city || !country) {
        setError("Address, city, and country are required for geocoding.");
        return;
      }

      const fullAddress = `${address}, ${city}, ${pincode ? pincode : ''}, ${country}`;
      const apiKey = "YOUR_API_KEY"; // Replace with your Google API key
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("API response data:", data); // Log API response to check structure

        if (data.status === "OK" && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          console.log("Coordinates fetched:", { lat, lng }); // Log fetched coordinates
          setCoordinates({ lat, lng }); // Update state with new coordinates
        } else {
          setError("No results found for the provided address.");
        }
      } catch (err) {
        setError("Error fetching coordinates: " + err.message);
        console.error("Error fetching coordinates:", err);
      }
    };

    getCoordinates();
  }, [address, city, country, pincode]); // Trigger fetch whenever address, city, country or pincode changes

  console.log("Current coordinates:", coordinates); // Log current coordinates

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : coordinates ? ( // Check if coordinates are available before rendering the map
        <MapContainer
          center={[coordinates.lat, coordinates.lng]} // Map will center based on the updated coordinates
          zoom={13} // Adjust zoom level based on your requirement
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>
              {address && city && country
                ? `${address}, ${city}, ${country}`
                : 'Location not found'}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Loading map...</p> // Show loading message until coordinates are fetched
      )}
    </div>
  );
};

export default Map;
