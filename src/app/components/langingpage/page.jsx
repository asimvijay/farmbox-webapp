"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FarmBox1 from "../../../../assets/images/Farmbox1.jpg";
import onion from "../../../../assets/images/onion.jpg";
import potatoes from "../../../../assets/images/potatoes.jpg";
import spring from "../../../../assets/images/Spring-Onions.jpg";
import beetroot from "../../../../assets/images/Beetroot.jpg";

const farmBoxes = [
  {
    title: "Build Your Own (FarmBox) Fruits, Veggies + More",
    price: "$35.62",
    description:
      "Enjoy a hand-picked selection of seasonal fruits and vegetables sourced from our favorite Texas and regional farm partners. Each box includes 7-8  produce items, mix of fruit and vegetables.",
    image: FarmBox1,
  },
  {
    title: "Wee FarmBox, Fruits & Veggies",
    price: "$20.99",
    description:
      "Enjoy a hand-picked selection of seasonal fruits and vegetables sourced from our favorite Texas and regional farm partners. Each box includes 7-8  produce items, mix of fruit and vegetables.",
    image: FarmBox1,
  },
  {
    title: "Wee FarmBox, Veggie Only",
    price: "$20.99",
    description:
      "Enjoy a hand-picked selection of seasonal fruits and vegetables sourced from our favorite Texas and regional farm partners. Each box includes 7-8  produce items, mix of fruit and vegetables.",
    image: FarmBox1,
  },
  {
    title: "Regular FarmBox, Mix Fruit & Veggie",
    price: "$37.99",
    description:
      "Our most popular farmbox - a weekly-changing variety of your classic fruit and vegetable favorites.",
    image: FarmBox1,
  },
  {
    title: "Build Your Own (FarmBox) Fruits, Veggies + More",
    price: "$35.62",
    description:
      "Enjoy a hand-picked selection of seasonal fruits and vegetables sourced from our favorite Texas and regional farm partners. Each box includes 7-8  produce items, mix of fruit and vegetables.",
    image: FarmBox1,
  },
  {
    title: "Wee FarmBox, Fruits & Veggies",
    price: "$20.99",
    description:
      "Enjoy a hand-picked selection of seasonal fruits and vegetables sourced from our favorite Texas and regional farm partners. Each box includes 7-8  produce items, mix of fruit and vegetables.",
    image: FarmBox1,
  },
  {
    title: "Wee FarmBox, Veggie Only",
    price: "$20.99",
    description:
      "Enjoy a hand-picked selection of seasonal fruits and vegetables sourced from our favorite Texas and regional farm partners. Each box includes 7-8  produce items, mix of fruit and vegetables.",
    image: FarmBox1,
  },
  {
    title: "Regular FarmBox, Mix Fruit & Veggie",
    price: "$37.99",
    description:
      "Our most popular farmbox - a weekly-changing variety of your classic fruit and vegetable favorites.",
    image: FarmBox1,
  },
];

const products = [
  {
    name: "ONION, RED - 1 CT",
    img: onion,
    count: 1,
    max: 10,
  },
  { name: "POTATOES, WILD - 5 OZ.", img: potatoes, count: 0, max: 10 },
  {
    name: "SPRING ONIONS, BUNCH - 1 BUNCH",
    img: spring,
    count: 0,
    max: 10,
  },
  { name: "BEETROOT, RED LEAF - 1 CT", img: beetroot, count: 0, max: 10 },
];

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="h-fit-content shadow-md z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-around items-center py-4">
        <Image
          src="/crop_logo.png"
          alt="FarmBox Logo"
          width={250}
          height={250}
        />
        <div className="hidden md:flex space-x-10 text-[1.8rem]">
          <div className="relative group">
            <Link
              href="#"
              className="text-green-600 hover:text-green-300 underline decoration-6 underline-offset-4 decoration-transparent hover:decoration-green-800 transition-shadow duration-300 transform hover:-translate-y-2 relative"
            >
              WHY FARMBOX
            </Link>

            {/* Dropdown Content - adjusted positioning */}
            <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-white shadow-lg border rounded-md p-3 w-2xl z-10">
              <Link
                href="#"
                className="block text-green-600 hover:text-green-300"
              >
                About Us
              </Link>
              <Link
                href="#"
                className="block text-green-600 hover:text-green-300"
              >
                How It Works
              </Link>
              <Link
                href="#"
                className="block text-green-600 hover:text-green-300"
              >
                Farmers And Producers
              </Link>
              <Link
                href="#"
                className="block text-green-600 hover:text-green-300"
              >
                FAQ's
              </Link>
              <Link
                href="#"
                className="block text-green-600 hover:text-green-300"
              >
                How Can I Get Started?
              </Link>
            </div>
          </div>
          <Link
            href="#"
            className="text-green-600 hover:text-green-300 underline decoration-6 underline-offset-4 decoration-transparent hover:decoration-green-800 transition-shadow duration-300 transform hover:-translate-y-2 relative"
          >
            PRODUCE BOXES
          </Link>

          <Link
            href="#"
            className="text-green-600 hover:text-green-300 underline decoration-6 underline-offset-4 decoration-transparent hover:decoration-green-800 transition-shadow duration-300 transform hover:-translate-y-2 relative"
          >
            GROCERIES
          </Link>
          <Link
            href="#"
            className="text-green-600 hover:text-green-300 underline decoration-6 underline-offset-4 decoration-transparent hover:decoration-green-800 transition-shadow duration-300 transform hover:-translate-y-2 relative"
          >
            WHERE WE DELIVER
          </Link>
        </div>
        <div className="hidden md:flex space-x-4">
          <button className=" border px-10 py-5 rounded-lg text-2xl">
            LOG IN
          </button>
          <button className="bg-green-500 text-white px-10 py-5 rounded-lg hover:bg-green-600 text-2xl">
            SIGN UP
          </button>
        </div>
        <button className="md:hidden text-green-600" onClick={toggleMobileMenu}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      <div
        className={`bg-green-600 h-20 text-white py-2 transition-all duration-300 ${
          isMobileMenuOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="max-w-7xl mx-auto flex items-center h-full">
          <div className="flex flex-col md:flex-row items-center w-full justify-around space-y-2 md:space-y-0">
            {[
              { name: "Staff Picks", links: ["Best Sellers", "Top Rated"] },
              {
                name: "New & Seasonal",
                links: ["Spring Specials", "Winter Picks"],
              },
              { name: "FarmBoxes", links: ["Organic Packs", "Budget Boxes"] },
              { name: "Produce", links: ["Fruits", "Vegetables"] },
            ].map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href="#"
                  className="decoration-4 underline-offset-4 hover:underline flex items-center text-2xl font-bold"
                >
                  {item.name}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white ml-2 font-bold"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>

                {/* Dropdown Content */}
                <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-green-600  border rounded-md p-3 w-2xs z-10">
                  {item.links.map((link) => (
                    <Link
                      key={link}
                      href="#"
                      className="block text-white text-2xl hover:text-green-300 py-1"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default function FarmBoxesPage() {
  const [openPopUp, setOpenPopUp] = useState(false);
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="w-screen mx-auto px-10 py-10">
        <h1 className="sm:text-2xl lg:text-7xl font-bold text-center mt-16 mb-16 text-green-900">
          SEASONAL FARMBOXES
        </h1>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
          {farmBoxes.map((box, index) => (
            <div
              key={index}
              className="border border-gray-200 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 relative"
            >
              <div className="grid relative">
                <Image
                  src={box.image}
                  alt={box.title}
                  width={400}
                  height={300}
                  className="w-full h-80 object-cover transform hover:scale-105 transition-transform duration-300"
                />

                <button
                  onClick={() => {
                    setOpenPopUp(true);
                  }}
                  className="absolute bottom-1/2 left-1/2 -translate-x-1/2  bg-white text-green-600 font-bold border-2 border-green-600 text-3xl py-2 px-4 rounded-md shadow-md hover:bg-green-800 hover:text-white hover:scale-105 hover:border-white transition-all duration-300 z-20"
                >
                  WHAT'S INSIDE
                </button>
              </div>

              <div className="flex flex-wrap pt-4 px-5">
                <h1 className="text-gray-400">FROM OUR FARMERS</h1>
                <h1 className="text-gray-400 ml-auto">{box.price}</h1>
              </div>
              <div className="px-5 pb-40">
                {" "}
                {/* Increased padding-bottom to prevent overlap */}
                <div className="flex flex-wrap py-5">
                  <h2 className="font-semibold w-4/6 text-lg text-black hover:text-green-700 transition-colors duration-300">
                    {box.title}
                  </h2>
                  <h5 className="w-2/6 text-sm pl-4 text-gray-400">
                    {" "}
                    Serves 1-2 people
                  </h5>
                </div>
                <div className="text-gray-600 text-sm mt-2 overflow-hidden">
                  <p className="m-0">{box.description}</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-200">
                {/* Dropdowns Section */}
                <div className="flex  mb-4 justify-evenly">
                  <div className="w-2/6">
                    <label className="block text-sm font-medium text-gray-500">
                      Quantity
                    </label>
                    <select className="border border-gray-500 rounded-md px-3 py-2 w-full">
                      <option className="text-gray-500">1</option>
                      <option className="text-gray-500">2</option>
                      <option className="text-gray-500">3</option>
                    </select>
                  </div>
                  <div className="w-4/7">
                    <label className="block text-sm font-medium text-gray-500">
                      Frequency
                    </label>
                    <select className="border border-gray-500 rounded-md px-3 py-2 w-full">
                      <option className="text-gray-500">Every Week</option>
                      <option className="text-gray-500">Every Month</option>
                    </select>
                  </div>
                </div>

                {/* Add to Delivery Button */}
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300">
                  + ADD TO DELIVERY
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {openPopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent overflow-y-auto bg-opacity-50 p-4">
          <div className="w-full max-w-6xl mx-auto relative bg-white rounded-lg overflow-y-auto">
            <div className="bg-green-900 p-4 md:p-8 w-full flex flex-col md:flex-row items-center justify-between">
              <h1 className="text-lg md:text-2xl font-bold text-white text-center mb-2 md:mb-0 md:mr-3.5">
                BOX CONTENTS FOR "BUILD YOUR OWN (FARMBOX) FRUITS, VEGGIES +
                MORE"
              </h1>
              <button
                onClick={() => setOpenPopUp(false)}
                className="text-xl md:text-2xl text-white"
              >
                X
              </button>
            </div>
            <div className="bg-white text-black p-4 md:p-6">
              <p className="text-center font-semibold text-xl md:text-3xl mb-3 md:mb-5">
                Showing the box contents for the week of:
              </p>
              <div className="text-center my-2">
                <select className="bg-white border-2 border-green-900 text-black text-base md:text-2xl font-extrabold p-1 md:p-2 rounded-md">
                  <option>03/24/2025 - 03/30/2025</option>
                </select>
              </div>
              <h2 className="bg-green-900 text-white p-2 mt-4 text-2xl md:text-4xl font-bold">
                VEGETABLES
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="border mt-3 md:mt-5 rounded-md overflow-hidden shadow-md"
                  >
                    <Image
                      src={product.img}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-40 md:h-80 object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-2 h-auto md:h-20 bg-yellow-100">
                      <h3 className="font-bold text-base md:text-xl">
                        {product.name}
                      </h3>
                      <p className="text-sm md:text-xl">
                        ({product.count} of max {product.max})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
