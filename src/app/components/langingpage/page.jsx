"use client"

import { useState } from "react";
import Image from "next/image";
import { farmBoxes } from "./data";



export default function FarmBoxGrid() {
  const [selectedBox, setSelectedBox] = useState(null);

  const handleBoxClick = (box) => {
    setSelectedBox(box);
  };

  return (
    <div className="overflow-x-hidden">

      <div className="w-screen mx-auto px-10 py-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
          SEASONAL FARMBOXES
        </h1>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
          {farmBoxes.map((box, index) => (
            <div
              key={index}
              className="border border-gray-200 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 relative"
              onClick={() => handleBoxClick(box)}
            >
              <div className="relative h-80">
                <Image
                  src={box.image}
                  alt={box.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBoxClick(box);
                  }}
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
                      className="border border-gray-500 rounded-md px-3 py-2 w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                  <div className="w-4/7">
                    <label className="block text-sm font-medium text-gray-500">
                      Frequency
                    </label>
                    <select 
                      className="border border-gray-500 rounded-md px-3 py-2 w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option>Every Week</option>
                      <option>Every Month</option>
                    </select>
                  </div>
                </div>
                <button 
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  + ADD TO DELIVERY
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP */}
      {selectedBox && selectedBox.items && selectedBox.items.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
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
              Showing box contents for the week of:{" "}
              <strong>03/24/2025 - 03/30/2025</strong>
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {selectedBox.items.map((item, id) => (
                <div
                  key={id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-32">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-700">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500">(0 of max 10)</p>
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