import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px"
};

const center = {
  lat: 20.302550,
  lng: 86.404246
};

export default function LocationPicker({ setLocation }) {

  const [marker, setMarker] = useState(null);

  const handleClick = (event) => {

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setMarker({ lat, lng });

    setLocation(lat, lng);
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onClick={handleClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </LoadScript>
  );
}