"use client"


import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FarmBox1 from "../../../../assets/images/Farmbox1.jpg";

// const farmBoxes = [
//   {
//     title: "Build Your Own (FarmBox) Fruits, Veggies + More",
//     price: "$35.62",
//     description:
//       "Enjoy a hand-picked selection of seasonal fruits and vegetables sourced from our favorite Texas and regional farm partners. Each box includes 7-8  produce items, mix of fruit and vegetables.",
//     image: FarmBox1,
//   },
//   {
//     title: "Wee FarmBox, Fruits & Veggies",
//     price: "$20.99",
//     description:
//       "Enjoy a hand-picked selection of seasonal fruits and vegetables sourced from our favorite Texas and regional farm partners. Each box includes 7-8  produce items, mix of fruit and vegetables.",
//     image: FarmBox1,
//   },
//   {
//     title: "Wee FarmBox, Veggie Only",
//     price: "$20.99",
//     description:
//       "Enjoy a hand-picked selection of seasonal fruits and vegetables sourced from our favorite Texas and regional farm partners. Each box includes 7-8  produce items, mix of fruit and vegetables.",
//     image: FarmBox1,
//   },
//   {
//     title: "Regular FarmBox, Mix Fruit & Veggie",
//     price: "$37.99",
//     description:
//       "Our most popular farmbox - a weekly-changing variety of your classic fruit and vegetable favorites.",
//     image: FarmBox1,
//   },
//   {
//     title: "Build Your Own (FarmBox) Fruits, Veggies + More",
//     price: "$35.62",
//     description:
//       "Enjoy a hand-picked selection of seasonal fruits and vegetables sourced from our favorite Texas and regional farm partners. Each box includes 7-8  produce items, mix of fruit and vegetables.",
//     image: FarmBox1,
//   },
//   {
//     title: "Wee FarmBox, Fruits & Veggies",
//     price: "$20.99",
//     description:
//       "Enjoy a hand-picked selection of seasonal fruits and vegetables sourced from our favorite Texas and regional farm partners. Each box includes 7-8  produce items, mix of fruit and vegetables.",
//     image: FarmBox1,
//   },
//   {
//     title: "Wee FarmBox, Veggie Only",
//     price: "$20.99",
//     description:
//       "Enjoy a hand-picked selection of seasonal fruits and vegetables sourced from our favorite Texas and regional farm partners. Each box includes 7-8  produce items, mix of fruit and vegetables.",
//     image: FarmBox1,
//   },
//   {
//     title: "Regular FarmBox, Mix Fruit & Veggie",
//     price: "$37.99",
//     description:
//       "Our most popular farmbox - a weekly-changing variety of your classic fruit and vegetable favorites.",
//     image: FarmBox1,
//   },
// ];

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <Image src="/crop_logo.png" alt="FarmBox Logo" width={150} height={50} />
        <div className="hidden md:flex space-x-6">
          <Link href="#" className="text-green-600 hover:text-green-300">WHY FARMBOX</Link>
          <Link href="#" className="text-green-600 hover:text-green-300">PRODUCE BOXES</Link>

          <Link href="#" className="text-green-600 hover:text-green-300">GROCERIES</Link>
          <Link href="#" className="text-green-600 hover:text-green-300">WHERE WE DELIVER</Link>
        </div>
        <div className="hidden md:flex space-x-4">
          <button className=" border px-4 py-2 rounded-lg">LOG IN</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">SIGN UP</button>
        </div>
        <button className="md:hidden text-green-600" onClick={toggleMobileMenu}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      <div className={`bg-green-600 text-white py-2 transition-all duration-300 ${isMobileMenuOpen ? "block" : "hidden"} md:block`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <Link href="#" className="hover:underline">Staff Picks</Link>

            <Link href="#" className="hover:underline">New & Seasonal</Link>
            <Link href="#" className="hover:underline">FarmBoxes</Link>

            <Link href="#" className="hover:underline">Produce</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};



export default function FarmBoxGrid() {
  const [selectedBox, setSelectedBox] = useState(null);

  const farmBoxes = [
    {
      title: "Build Your Own (FarmBox) Fruits, Veggies + More",
      price: "$35.62",
      description:
        "Enjoy a hand-picked selection of seasonal fruits and vegetables sourced from our favorite Texas and regional farm partners. Each box includes 7-8 produce items, mix of fruit and vegetables.",
      image: FarmBox1,
      items: [
        {
          name: "ONION, RED - 1 CT",
          image: "https://images.unsplash.com/photo-1617137988593-3cfaed19833f",
        },
        {
          name: "ARUGULA, WILD - 5 OZ.",
          image: "https://images.unsplash.com/photo-1615485290244-3adf9df0c6f3",
        },
        {
          name: "BROCCOLI, BUNCH - 1 BUNCH",
          image: "https://images.unsplash.com/photo-1571689936040-60506bfa007f",
        },
        {
          name: "LETTUCE, RED LEAF - 1 CT",
          image: "https://images.unsplash.com/photo-1582515068068-c85c2072d5bc",
        },
        {
          name: "CORN, BI-COLOR (QTY 3)",
          image: "https://images.unsplash.com/photo-1609710228159-009d0e5cc4f4",
        },
        {
          name: "BABY BOK CHOY, 0.75 LB",
          image: "https://images.unsplash.com/photo-1621842528914-493399bc72b9",
        },
        {
          name: "LETTUCE, ROMAINE - 1 CT",
          image: "https://images.unsplash.com/photo-1602631985686-70346c02c6e5",
        },
        {
          name: "PARSLEY, ITALIAN FLAT LEAF - 1 BUNCH",
          image: "https://images.unsplash.com/photo-1590080876797-bda0f21c7093",
        },
        {
          name: "BELL PEPPER, GREEN - 2 CT",
          image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
        },
        {
          name: "SQUASH, ZUCCHINI - 2 CT",
          image: "https://images.unsplash.com/photo-1567303311830-3954f7a7a1f5",
        },
      ],
    },
    {
      title: "Wee FarmBox, Fruits & Veggies",
      price: "$20.99",
      description:
        "Enjoy a hand-picked selection of seasonal fruits and vegetables sourced from our favorite Texas and regional farm partners.",
      image: FarmBox1,
      items: [],
    },
    {
      title: "Wee FarmBox, Veggie Only",
      price: "$20.99",
      description:
        "A great box for veggie lovers! Enjoy seasonal produce curated fresh weekly.",
      image: FarmBox1,
      items: [],
    },
    {
      title: "Regular FarmBox, Mix Fruit & Veggie",
      price: "$37.99",
      description:
        "Our most popular farmbox - a weekly-changing variety of your classic fruit and vegetable favorites.",
      image: FarmBox1,
      items: [],
    },
  ];

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="w-screen mx-auto px-10 py-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
          SEASONAL FARMBOXES
        </h1>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
          {farmBoxes.map((box, index) => (
            <div
              key={index}
              className="border border-gray-200 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 relative"
            >
              <div className="relative">
                <img
                  src={box.image}
                  alt={box.title}
                  className="w-full h-80 object-cover"
                />
                <button
                  className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded shadow hover:bg-green-700 transition"
                  onClick={() => setSelectedBox(box)}
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
                    <select className="border border-gray-500 rounded-md px-3 py-2 w-full">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                  <div className="w-4/7">
                    <label className="block text-sm font-medium text-gray-500">
                      Frequency
                    </label>
                    <select className="border border-gray-500 rounded-md px-3 py-2 w-full">
                      <option>Every Week</option>
                      <option>Every Month</option>
                    </select>
                  </div>
                </div>
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300">
                  + ADD TO DELIVERY
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedBox && selectedBox.items && selectedBox.items.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-y-auto max-h-[90vh] p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
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
                  className="border rounded-lg overflow-hidden shadow-sm"
                >
                  <Image
                    width={300}
                    height={200}
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover"
                  />
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
