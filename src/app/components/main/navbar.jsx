"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CropLogo from "@/public/crop_logo.png";
import LoggedInUserIcon from "@/public/user.png";
import ProfilePopup from "./profile";
import MyOrders from "./myorder";
import MyCart from "./mycart";
import {
  checkAuthStatus,
  handleLogout,
  toggleProfilePopup,
  toggleMyOrders,
  toggleMyCart,
  toggleMobileMenu,
  closeMobileMenu,
  toggleWhyFarmbox
} from "@/hooks/checkauth";

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWhyFarmboxOpen, setWhyFarmboxOpen] = useState(false);
  const [isProduceBoxesOpen, setProduceBoxesOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [userOrder, setUserOrder] = useState(null);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [showMyCart, setShowMyCart] = useState(false);
  const [userCart, setUserCart] = useState(null);

  useEffect(() => {
    checkAuthStatus(setIsLoggedIn, setUserData, setUserOrder, setUserCart);

    const handleCartUpdate = () => {
      checkAuthStatus(setIsLoggedIn, setUserData, setUserOrder, setUserCart);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const produceBoxCategories = [
    { name: "Season Boxes", path: "/farmboxes?category=season" },
    { name: "Featured Boxes", path: "/farmboxes?category=featured" },
    { name: "Vegetable Box", path: "/farmboxes?category=vegetable" },
    { name: "Fruit Box", path: "/farmboxes?category=fruit" },
  ];

  return (
    <nav className="shadow-md">
      <div
        className={`relative z-10000 max-w-7xl mx-auto px-7 sm:px-6 lg:px-8 flex justify-between bg-white items-center py-4 transform transition-all duration-1000 ease-out ${
          isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex-shrink-0">
          <button onClick={() => window.location.href = "/"}>
            <Image 
              src={CropLogo} 
              alt="FarmBox Logo" 
              width={150} 
              height={50} 
              priority 
            />
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className="relative group">
            <div 
              className="text-green-600 hover:text-green-300 flex items-center cursor-pointer"
              onClick={() => toggleWhyFarmbox(setWhyFarmboxOpen, isWhyFarmboxOpen)}
            >
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

            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10000 opacity-0 invisible cursor-pointer group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 group-hover:delay-300">
              <Link href="/aboutus?section=about-us" className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-green-50">ABOUT US</Link>
              <Link href="/aboutus?section=how-it-works" className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-green-50">HOW IT WORKS</Link>
              <Link href="/aboutus?section=farmers-producers" className="block px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-green-50">FARMERS AND PRODUCERS</Link>
              <Link href="/aboutus?section=faqs" className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-green-50">FAQ'S</Link>
            </div>
          </div>

          <div className="relative group">
            <div 
              className="text-green-600 hover:text-green-300 flex items-center cursor-pointer"
              onClick={() => setProduceBoxesOpen(!isProduceBoxesOpen)}
            >
              PRODUCE BOXES
              <svg 
                className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10000 opacity-0 invisible cursor-pointer group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 group-hover:delay-300">
              {produceBoxCategories.map((category, index) => (
                <Link 
                  key={index} 
                  href={category.path} 
                  className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-green-50"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <Link href="#" className="text-green-600 hover:text-green-300 cursor-pointer">GROCERIES</Link>
          <Link href="/delivery" className="text-green-600 cursor-pointer hover:text-green-300">WHERE WE DELIVER</Link>
        </div>

        <div className="hidden md:flex flex-col items-center space-y-1">
          {isLoggedIn ? (
            <div className="relative group flex flex-col items-center">
              <Image 
                src={LoggedInUserIcon} 
                alt="User Profile" 
                width={40} 
                height={40} 
                className="rounded-full cursor-pointer"
              />
              <span className="text-sm text-green-600">{userData?.name || 'My Account'}</span>

              <div className="absolute right-0 mt-12 w-48 bg-white rounded-md cursor-pointer shadow-lg py-1 z-10000 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 group-hover:delay-300">
                <button 
                  onClick={() => toggleProfilePopup(setShowProfilePopup, showProfilePopup)} 
                  className="block w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                >
                  My Profile
                </button>
                <button 
                  onClick={() => toggleMyCart(setShowMyCart, showMyCart, userCart)} 
                  className="block w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                >
                  My Cart
                </button>
                <button 
                  onClick={() => toggleMyOrders(setShowMyOrders, showMyOrders, userOrder)} 
                  className="block w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                >
                  My Orders
                </button>
                <button 
                  onClick={() => handleLogout(setIsLoggedIn, setUserData)} 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button 
                className="border px-4 py-2 cursor-pointer border-gray-600 text-gray-600 rounded-lg" 
                onClick={() => window.location.href = "/login"}
              >
                LOG IN
              </button>
              <button 
                className="bg-green-500 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-green-600" 
                onClick={() => window.location.href = "/signup"}
              >
                SIGN UP
              </button>
            </div>
          )}
        </div>

        <button 
          className="md:hidden text-green-600" 
          onClick={() => toggleMobileMenu(setMobileMenuOpen, isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {showProfilePopup && (
        <div className="absolute top-24 right-6 z-[10001]">
          <ProfilePopup onClose={() => setShowProfilePopup(false)} userData={userData} />
        </div>
      )}
      {showMyOrders && (
        <div className="absolute top-24 right-6 z-[10001]">
          <MyOrders onClose={() => setShowMyOrders(false)} orders={userOrder} />
        </div>
      )}
      {showMyCart && (
        <div className="absolute top-24 right-6 z-[10001]">
          <MyCart onClose={() => setShowMyCart(false)} cart={userCart} />
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-2">
            {isLoggedIn && (
              <div className="flex items-center space-x-2 pb-4 border-b border-gray-200">
                <Image 
                  src={LoggedInUserIcon} 
                  alt="User Profile" 
                  width={32} 
                  height={32} 
                  className="rounded-full"
                />
                <span className="text-green-600">{userData?.name || 'My Account'}</span>
              </div>
            )}
            
            <Link 
              href="/" 
              className="text-green-600 hover:text-green-300 py-2 px-2"
              onClick={() => closeMobileMenu(setMobileMenuOpen)}
            >
              HOME
            </Link>
            
            <div className="flex flex-col">
              <button 
                onClick={() => toggleWhyFarmbox(setWhyFarmboxOpen, isWhyFarmboxOpen)}
                className="text-green-600 hover:text-green-300 py-2 px-2 flex justify-between items-center"
              >
                <span>WHY FARMBOX</span>
                <svg 
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${isWhyFarmboxOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${isWhyFarmboxOpen ? 'max-h-40' : 'max-h-0'}`}>
                <Link 
                  href="/aboutus?section=about-us" 
                  className="block py-2 px-6 text-green-600 hover:text-green-300"
                  onClick={() => closeMobileMenu(setMobileMenuOpen)}
                >
                  ABOUT US
                </Link>
                <Link 
                  href="/aboutus?section=how-it-works" 
                  className="block py-2 px-6 text-green-600 hover:text-green-300"
                  onClick={() => closeMobileMenu(setMobileMenuOpen)}
                >
                  HOW IT WORKS
                </Link>
                <Link 
                  href="/aboutus?section=farmers-producers" 
                  className="block py-2 px-6 text-green-600 hover:text-green-300"
                  onClick={() => closeMobileMenu(setMobileMenuOpen)}
                >
                  FARMERS AND PRODUCERS
                </Link>
                <Link 
                  href="/aboutus?section=faqs" 
                  className="block py-2 px-6 text-green-600 hover:text-green-300"
                  onClick={() => closeMobileMenu(setMobileMenuOpen)}
                >
                  FAQ'S
                </Link>
              </div>
            </div>

            <div className="flex flex-col">
              <button 
                onClick={() => setProduceBoxesOpen(!isProduceBoxesOpen)}
                className="text-green-600 hover:text-green-300 py-2 px-2 flex justify-between items-center"
              >
                <span>PRODUCE BOXES</span>
                <svg 
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${isProduceBoxesOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${isProduceBoxesOpen ? 'max-h-40' : 'max-h-0'}`}>
                {produceBoxCategories.map((category, index) => (
                  <Link 
                    key={index} 
                    href={category.path} 
                    className="block py-2 px-6 text-green-600 hover:text-green-300"
                    onClick={() => closeMobileMenu(setMobileMenuOpen)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link 
              href="#" 
              className="text-green-600 hover:text-green-300 py-2 px-2"
              onClick={() => closeMobileMenu(setMobileMenuOpen)}
            >
              GROCERIES
            </Link>
            <Link 
              href="/delivery" 
              className="text-green-600 hover:text-green-300 py-2 px-2"
              onClick={() => closeMobileMenu(setMobileMenuOpen)}
            >
              WHERE WE DELIVER
            </Link>
            <Link 
              href="#" 
              className="text-green-600 hover:text-green-300 py-2 px-2"
              onClick={() => closeMobileMenu(setMobileMenuOpen)}
            >
              GIFT CARDS
            </Link>
            
            <div className="flex space-x-4 pt-4">
              {isLoggedIn ? (
                <button 
                  className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full" 
                  onClick={() => {
                    closeMobileMenu(setMobileMenuOpen);
                    handleLogout(setIsLoggedIn, setUserData);
                  }}
                >
                  LOGOUT
                </button>
              ) : (
                <>
                  <button 
                    className="border cursor-pointer border-green-600 text-green-600 px-4 py-2 rounded-lg w-full" 
                    onClick={() => {
                      closeMobileMenu(setMobileMenuOpen);
                      window.location.href = "/login";
                    }}
                  >
                    LOG IN
                  </button>
                  <button 
                    className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full" 
                    onClick={() => {
                      closeMobileMenu(setMobileMenuOpen);
                      window.location.href = "/signup";
                    }}
                  >
                    SIGN UP
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .group:hover .group-hover\:delay-300 {
          transition-delay: 300ms;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;