

import { MapContainer, TileLayer, Marker as LeafletMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import FarmM from '../../../../assets/images/farm-m.png';

export default function FarmMap({ farmers, center, onMapReady }) {
  // Fix for default marker icons
  const DefaultIcon = L.icon({
    iconUrl: '/images/marker-icon.jpg',
    iconRetinaUrl: '/images/marker-icon2x.jpg',
    shadowUrl: '/images/marker-shadow.jpg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  L.Marker.prototype.options.icon = DefaultIcon;

  // Custom farm icon
  const createFarmIcon = () => L.icon({
    iconUrl: FarmM.src,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  return (
    <MapContainer 
      center={center} 
      zoom={7} 
      style={{ height: '100%', width: '100%' }}
      whenReady={onMapReady}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {farmers.map((farmer) => (
        <LeafletMarker 
          key={farmer.id} 
          position={farmer.coordinates}
          icon={createFarmIcon()}
        >
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-lg">{farmer.name}</h3>
              <p className="text-gray-600">{farmer.location}</p>
              <p className="text-sm mt-1"><span className="font-semibold">Specialty:</span> {farmer.specialty}</p>
            </div>
          </Popup>
        </LeafletMarker>
      ))}
    </MapContainer>
  );
}