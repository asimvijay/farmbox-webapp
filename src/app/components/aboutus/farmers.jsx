"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaTractor, FaSeedling, FaMapMarkerAlt, FaRegHandshake } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import FarmerImage from '../../../../assets/images/farmer.webp';
import FarmImage from '../../../../assets/images/organic-farm.png';
import MarkerIcon from "../../../../assets/images/marker-icon.jpg";
import MarkerIcon2x from "../../../../assets/images/marker-icon2x.jpg";
import MarkerShadow from "../../../../assets/images/marker-shadow.jpg";
import FarmM from '../../../../assets/images/farm-m.png';
// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: MarkerIcon.src,
  iconRetinaUrl: MarkerIcon2x.src,
  shadowUrl: MarkerShadow.src,
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

const farmers = [
  {
    id: 1,
    name: "Green Valley Organic Farm",
    location: "Salinas Valley, CA",
    coordinates: [36.6777, -121.6555],
    specialty: "Leafy Greens & Herbs",
    since: 2010,
    image: FarmerImage,
    quote: "We believe in growing food the way nature intended - with care for the land and the people who eat from it."
  },
  {
    id: 2,
    name: "Sunrise Fruit Orchards",
    location: "Central Valley, CA",
    coordinates: [36.9906, -120.0078],
    specialty: "Stone Fruits & Citrus",
    since: 1995,
    image: FarmImage,
    quote: "Our family has been growing fruits for three generations, and FarmBox helps us reach families directly."
  },
  {
    id: 3,
    name: "Heritage Pastures",
    location: "Sonoma County, CA",
    coordinates: [38.5270, -122.9285],
    specialty: "Grass-Fed Beef & Dairy",
    since: 2008,
    image: FarmerImage,
    quote: "Sustainable grazing practices produce healthier animals and more nutritious products for your family."
  }
];

const benefits = [
  {
    icon: <FaTractor className="text-3xl text-green-600" />,
    title: "Direct Partnership",
    description: "We work directly with farmers to ensure fair prices and sustainable practices"
  },
  {
    icon: <FaSeedling className="text-3xl text-green-600" />,
    title: "Seasonal Variety",
    description: "Our network of farms provides diverse produce all year round"
  },
  {
    icon: <FaMapMarkerAlt className="text-3xl text-green-600" />,
    title: "Local Focus",
    description: "85% of our produce comes from within 150 miles of delivery areas"
  },
  {
    icon: <FaRegHandshake className="text-3xl text-green-600" />,
    title: "Fair Compensation",
    description: "Farmers earn 25-40% more than wholesale market rates"
  }
];

export default function FarmersAndProducers() {
  const [mapReady, setMapReady] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Farmers & Producers</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Meet the passionate growers and artisans who make FarmBox possible.
          </p>
        </div>
      </div>

      {/* Partnership Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Farming Partnerships</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">{benefit.title}</h3>
              <p className="text-gray-600 text-center">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Farm Locations</h2>
          <div className="h-96 w-full rounded-lg overflow-hidden shadow-xl relative">
            {typeof window !== 'undefined' && (
              <MapContainer 
                center={[36.7783, -119.4179]} 
                zoom={7} 
                style={{ height: '100%', width: '100%' }}
                whenReady={() => setMapReady(true)}
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
            )}
            {!mapReady && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <span className="text-gray-500">Loading map...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Farmers */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Farmers</h2>
          <div className="space-y-16">
            {farmers.map((farmer, index) => (
              <div key={farmer.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <div className="lg:w-1/2">
                  <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src={farmer.image}
                      alt={`${farmer.name} in ${farmer.location}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{farmer.name}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{farmer.location}</span>
                  </div>
                  <p className="text-lg text-gray-600 mb-4">
                    <span className="font-semibold">Specialty:</span> {farmer.specialty}<br />
                    <span className="font-semibold">Partner since:</span> {farmer.since}
                  </p>
                  <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-700">
                    "{farmer.quote}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Support Local Agriculture</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Every FarmBox purchase directly supports family farms in your region.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-green-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-300">
              Join FarmBox
            </button>
            <button className="border-2 border-white text-white hover:bg-green-600 font-bold py-3 px-8 rounded-lg transition duration-300">
              Contact Farmers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}