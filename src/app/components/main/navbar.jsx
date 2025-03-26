"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CropLogo from "../../../../public/crop_logo.png";
const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWhyFarmboxOpen, setWhyFarmboxOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleWhyFarmbox = () => {
    setWhyFarmboxOpen(!isWhyFarmboxOpen);
  };

  // Secondary navbar items from your image
  const secondaryNavItems = [
    "Staff Picks",
    "New & Trending",
    "Farmers Market",
    "Producer Boxes",
    "Products ",
    "Meal Kits",
    "Daily & Eggs ",
    "Sales",
    "Gift Cards",
    "Specialty Boxes",
  ];

  return (
    <nav className="shadow-md">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
<button className="cursor-pointer"   onClick={() => window.location.href = "/"}>
<Image 
          src={CropLogo} 
          alt="FarmBox Logo" 
          width={150} 
          height={50} 
          priority
        
          
        />
</button>
        <div className="hidden md:flex space-x-6 items-center">
          {/* WHY FARMBOX Dropdown - Hover on desktop */}
          <div className="relative group">
            <div className="text-green-600 hover:text-green-300 flex items-center cursor-pointer">
              WHY FARMBOX
              <svg 
                className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {/* Dropdown Content - Shows on hover */}
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2">
              <Link href="/aboutus?section=about-us" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">ABOUT US</Link>
              <Link href="/aboutus?section=how-it-works" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">HOW IT WORKS</Link>
              <Link href="/aboutus?section=farmers-producers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">FARMERS AND PRODUCERS</Link>
              <Link href="/aboutus?section=faqs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">FAQ'S</Link>
            </div>
          </div>

          <Link href="#" className="text-green-600 hover:text-green-300">PRODUCE BOXES</Link>
          <Link href="#" className="text-green-600 hover:text-green-300">GROCERIES</Link>
          <Link href="#" className="text-green-600 hover:text-green-300">WHERE WE DELIVER</Link>
        </div>
        <div className="hidden md:flex space-x-4">
          <button className="border px-4 py-2 rounded-lg">LOG IN</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">SIGN UP</button>
        </div>
        <button className="md:hidden text-green-600" onClick={toggleMobileMenu}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Secondary Navbar - Hidden on mobile */}
      <div className="hidden md:block bg-green-500 border-t border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 overflow-x-auto py-2 hide-scrollbar">
            {secondaryNavItems.map((item, index) => (
              <Link 
                key={index} 
                href="#" 
                className="whitespace-nowrap text-white hover:text-green-600"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-2">
            <Link href="#" className="text-green-600 hover:text-green-300 py-2 px-2">HOME</Link>
            
            {/* Mobile WHY FARMBOX Dropdown - Click on mobile */}
            <div className="flex flex-col">
              <button 
                onClick={toggleWhyFarmbox}
                className="text-green-600 hover:text-green-300 py-2 px-2 flex justify-between items-center"
              >
                <span>WHY FARMBOX</span>
                <svg 
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${isWhyFarmboxOpen ? '' : 'rotate-270'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${isWhyFarmboxOpen ? 'max-h-40' : 'max-h-0'}`}>
                <Link href="/aboutus?section=about-us" className="block py-2 px-6 text-green-600 hover:text-green-300">ABOUT US</Link>
                <Link href="/aboutus?section=how-it-works" className="block py-2 px-6 text-green-600 hover:text-green-300">HOW IT WORKS</Link>
                <Link href="/aboutus?section=farmers-producers" className="block py-2 px-6 text-green-600 hover:text-green-300">FARMERS AND PRODUCERS</Link>
                <Link href="/aboutus?section=faqs" className="block py-2 px-6 text-green-600 hover:text-green-300">FAQ'S</Link>
              </div>
            </div>

            <Link href="#" className="text-green-600 hover:text-green-300 py-2 px-2">HOW CAN I GET STARTED?</Link>
            <Link href="#" className="text-green-600 hover:text-green-300 py-2 px-2">PRODUCE BOXES</Link>
            <Link href="#" className="text-green-600 hover:text-green-300 py-2 px-2">BUTCHER BOX</Link>
            <Link href="#" className="text-green-600 hover:text-green-300 py-2 px-2">GROCERIES</Link>
            <Link href="#" className="text-green-600 hover:text-green-300 py-2 px-2">WHERE WE DELIVER</Link>
            <Link href="#" className="text-green-600 hover:text-green-300 py-2 px-2">BUY A GIFT CARD!</Link>
            
            <div className="flex space-x-4 pt-4">
              <button className="border border-green-600 text-green-600 px-4 py-2 rounded-lg w-full">LOG IN</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full">SIGN UP</button>
            </div>
          </div>
        </div>
      )}

      {/* Add this to your global CSS or in a style tag */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;