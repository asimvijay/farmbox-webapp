"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Farmbox1 from "@/public/Farmbox1.jpg";

export default function FarmBoxGrid() {
  const [selectedBox, setSelectedBox] = useState(null);
  const [farmboxes, setFarmboxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmboxes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/farmboxes');
        if (!response.ok) throw new Error('Failed to fetch farmboxes');
        const data = await response.json();
        
        const processedData = data.map(box => ({
          ...box,
          title: box.name,          // Map name to title
          items: JSON.parse(box.products),  // Parse products string to array
          price: `₹${box.price}`,    // Format price with currency symbol
        }));
        
        setFarmboxes(processedData);
        setError(null);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmboxes();
  }, []);

  const handleBoxClick = (box) => {
    setSelectedBox(box);
  };

  if (loading) {
    return (
      <div className="overflow-x-hidden">
        <div className="w-screen mx-auto px-10 py-10">
          <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
            SEASONAL FARMBOXES
          </h1>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-80 w-full"></div>
                  <div className="p-5 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="p-5 bg-gray-100 space-y-4">
                    <div className="flex space-x-4">
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen mx-auto px-10 py-10 text-center">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
          SEASONAL FARMBOXES
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <div className="w-screen mx-auto px-10 py-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
          SEASONAL FARMBOXES
        </h1>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
          {farmboxes.map((box, index) => (
            <div
              key={box.id}
              className="border border-gray-200 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 relative"
              onClick={() => handleBoxClick(box)}
            >
              <div className="relative h-80">
                <Image
                  src={Farmbox1.src}
                  alt={box.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 4}  // Prioritize above-the-fold images
                />
                <button
                  className="absolute top-3 right-3 bg-green-600 text-white cursor-pointer text-xs px-3 py-1 rounded shadow hover:bg-green-700 transition z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBoxClick(box);
                  }}
                >
                  WHAT'S INSIDE
                </button>
              </div>
              <div className="flex flex-wrap pt-4 px-5">
                <h1 className="text-gray-400">FROM OUR FARMERS</h1>
                <h1 className="text-gray-400 ml-auto">{box.price}</h1>
              </div>
              <div className="px-5 pb-40">
                <div className="flex flex-wrap py-5">
                  <h2 className="font-semibold w-4/6 text-lg text-black hover:text-green-700 transition-colors duration-300">
                    {box.title}
                  </h2>
                  <h5 className="w-2/6 text-sm pl-4 text-gray-400">
                    Serves 1-2 people
                  </h5>
                </div>
                <p className="text-gray-600 text-sm mt-2">{box.description}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-200">
                <div className="flex mb-4 justify-evenly">
                  <div className="w-2/6">
                    <label className="block text-sm font-medium text-gray-500">
                      Quantity
                    </label>
                    <select 
                      className="border border-gray-500 rounded-md text-gray-500 px-3 py-2 w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {[...Array(box.maxquantity).keys()].map(num => (
                        <option key={num+1} value={num+1}>{num+1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-4/7">
                    <label className="block text-sm font-medium text-gray-500">
                      Frequency
                    </label>
                    <select 
                      className="border border-gray-500 rounded-md text-gray-500 px-3 py-2 w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option>{box.deliveryfrequency}</option>
                      <option>Every Month</option>
                    </select>
                  </div>
                </div>
                <button 
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to cart logic here
                  }}
                >
                  🛒 ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedBox && (
        <div className="fixed inset-0 z-10001 flex items-center justify-center backdrop-blur-sm">
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 cursor-pointer"
              onClick={() => setSelectedBox(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              BOX CONTENTS FOR "{selectedBox.title.toUpperCase()}"
            </h2>
            <p className="text-sm mb-4 text-gray-600">
              Delivery Frequency: <strong>{selectedBox.deliveryfrequency}</strong>
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {selectedBox.items.map((item, id) => (
                <div
                  key={id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-700">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm text-green-600 mt-1">Rs.{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}