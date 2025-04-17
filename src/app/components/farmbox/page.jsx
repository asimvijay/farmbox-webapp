"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Farmbox1 from "@/public/Farmbox1.jpg";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function FarmBoxGrid() {
  const [selectedBox, setSelectedBox] = useState(null);
  const [farmboxes, setFarmboxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [frequencies, setFrequencies] = useState({});
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/farmboxes/check');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        }
      } catch (error) {
        console.error('User check error:', error);
      }
    };

    checkUser();
    fetchFarmboxes();
  }, []);

  const fetchFarmboxes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/farmboxes');
      if (!response.ok) throw new Error('Failed to fetch farmboxes');
      const data = await response.json();
      
      const processedData = data.map(box => ({
        ...box,
        title: box.name,
        items: JSON.parse(box.products),
        price: `₹${box.price}`,
      }));
      
      const initialQuantities = {};
      const initialFrequencies = {};
      processedData.forEach(box => {
        initialQuantities[box.id] = 1;
        initialFrequencies[box.id] = box.deliveryfrequency;
      });
      
      setQuantities(initialQuantities);
      setFrequencies(initialFrequencies);
      setFarmboxes(processedData);
      setError(null);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBoxClick = (box) => {
    setSelectedBox(box);
  };

  const handleQuantityChange = (boxId, value) => {
    setQuantities(prev => ({
      ...prev,
      [boxId]: parseInt(value, 10)
    }));
  };

  const handleFrequencyChange = (boxId, value) => {
    setFrequencies(prev => ({
      ...prev,
      [boxId]: value
    }));
  };

  const loginGuestUser = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const createGuestUser = async () => {
    try {
      const formatPakistaniNumber = (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11 && cleaned.startsWith('0')) {
          return `+92${cleaned.substring(1)}`;
        } else if (cleaned.length === 12 && cleaned.startsWith('92')) {
          return `+${cleaned}`;
        }
        return phone;
      };
  
      let namePhone;
      let formattedPhone;
      let phoneValid = false;
  
      while (!phoneValid) {
        const result = await Swal.fire({
          title: 'Enter your details',
          html: `
            <div class="flex flex-col items-center">
              <input id="swal-input1" class="swal2-input mb-2 w-full" placeholder="Your Name" required>
              <div class="flex items-center w-full mb-2">
                <span class="mr-2 text-sm whitespace-nowrap">🇵🇰 +92</span>
                <input id="swal-input2" class="swal2-input flex-1" placeholder="3XX-XXXXXXX" type="tel" required>
              </div>
              <p class="text-xs text-gray-500 mt-2 text-center">
                Enter your 11-digit Pakistani number (without +92)
              </p>
            </div>
          `,
          focusConfirm: false,
          confirmButtonText: 'Submit',
          showCloseButton: true,
          preConfirm: () => {
            const name = document.getElementById('swal-input1').value.trim();
            const phone = document.getElementById('swal-input2').value.trim();
  
            if (!name || !phone) {
              Swal.showValidationMessage('Please fill out all fields');
              return false;
            }
  
            return { name, phone };
          },
          didOpen: () => {
            document.getElementById('swal-input1').focus();
          },
        });
  
        if (result.isDismissed && result.dismiss === Swal.DismissReason.close) {
          return null;
        }
        if (!result.value) return null;
  
        const cleaned = result.value.phone.replace(/\D/g, '');
        if (!/^[0-9]{10,11}$/.test(cleaned)) {
          const errorResult = await Swal.fire({
            title: 'Invalid Number',
            text: 'Please enter a valid 11-digit Pakistani number',
            icon: 'error',
            confirmButtonText: 'Try Again',
            showCloseButton: true,
          });
          if (errorResult.isDismissed && errorResult.dismiss === Swal.DismissReason.close) {
            return null;
          }
          continue;
        }
  
        formattedPhone = formatPakistaniNumber(result.value.phone);
  
        if (/^\+92[0-9]{10}$/.test(formattedPhone)) {
          namePhone = {
            name: result.value.name,
            phone: formattedPhone,
          };
          phoneValid = true;
        } else {
          const errorResult = await Swal.fire({
            title: 'Invalid Number',
            text: 'Please enter a valid Pakistani phone number (11 digits starting with 0)',
            icon: 'error',
            confirmButtonText: 'Try Again',
            showCloseButton: true,
          });
          if (errorResult.isDismissed && errorResult.dismiss === Swal.DismissReason.close) {
            return null;
          }
        }
      }
  
      // Check if the phone number is +923240251086
      if (namePhone.phone !== '+923240251086') {
        const featureResult = await Swal.fire({
          title: 'Feature Coming Soon',
          html: `
            <div class="text-center">
              <p class="text-lg text-gray-700 mb-4">
                This verification method will be available in future updates!
              </p>
              <p class="text-sm text-gray-500">
                Please continue to login with your existing account
              </p>
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'Continue to Login',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          showCloseButton: true,
          focusConfirm: false,
        });
        if (featureResult.isDismissed && featureResult.dismiss === Swal.DismissReason.close) {
          return null;
        }
        if (featureResult.isConfirmed) {
          router.push('/login');
        }
        return null;
      }
  
      // Proceed with OTP verification for +923240251086
      const otpResponse = await fetch('/api/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(namePhone),
      });
  
      if (!otpResponse.ok) {
        const errorData = await otpResponse.json();
        throw new Error(errorData.message || 'Failed to send OTP');
      }
  
      let otpVerified = false;
      let otpAttempts = 0;
      let guestUser = null;
      let password = null;
  
      while (!otpVerified && otpAttempts < 3) {
        const otpResult = await Swal.fire({
          title: 'Verify OTP',
          html: `
            <p>We've sent an OTP to your WhatsApp number:</p>
            <p class="font-semibold">🇵🇰 ${namePhone.phone}</p>
            <input id="swal-input-otp" class="swal2-input mt-4" placeholder="Enter 6-digit OTP" required>
            ${
              otpAttempts > 0
                ? `<p class="text-red-500 text-sm mt-2">Incorrect OTP. ${
                    3 - otpAttempts
                  } attempts remaining</p>`
                : ''
            }
          `,
          focusConfirm: false,
          showCancelButton: true,
          cancelButtonText: 'Resend OTP',
          confirmButtonText: 'Verify',
          showCloseButton: true,
          preConfirm: () => {
            return document.getElementById('swal-input-otp').value;
          },
          didOpen: () => {
            document.getElementById('swal-input-otp').focus();
          },
        });
  
        if (otpResult.isDismissed && otpResult.dismiss === Swal.DismissReason.close) {
          return null;
        }
        if (
          otpResult.isDismissed &&
          otpResult.dismiss === Swal.DismissReason.cancel
        ) {
          await fetch('/api/guest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(namePhone),
          });
          otpAttempts = 0;
          continue;
        }
  
        if (!otpResult.value) return null;
  
        otpAttempts++;
  
        const verifyResponse = await fetch('/api/guest/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: namePhone.phone,
            otp: otpResult.value,
            name: namePhone.name,
          }),
        });
  
        if (verifyResponse.ok) {
          const verified = await verifyResponse.json();
          guestUser = verified.user;
          password = verified.password;
          if (!guestUser?.id || !guestUser?.phone) {
            throw new Error('Guest user data missing id or phone');
          }
          otpVerified = true;
        } else if (otpAttempts >= 3) {
          throw new Error('Too many incorrect OTP attempts');
        }
      }
  
      if (!otpVerified) return null;
  
      const addressResult = await Swal.fire({
        title: 'Delivery Information',
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="Delivery Address" required>' +
          '<input id="swal-input2" class="swal2-input" placeholder="City" required>' +
          '<input id="swal-input3" class="swal2-input" placeholder="Postal Code" required>' +
          '<input id="swal-input4" class="swal2-input" placeholder="Area (Optional)">' +
          '<input id="swal-input5" class="swal2-input" placeholder="Country" value="Pakistan" required>',
        focusConfirm: false,
        showCloseButton: true,
        preConfirm: () => {
          return {
            address: document.getElementById('swal-input1').value,
            city: document.getElementById('swal-input2').value,
            postalCode: document.getElementById('swal-input3').value,
            area: document.getElementById('swal-input4').value || null,
            country: document.getElementById('swal-input5').value,
          };
        },
        didOpen: () => {
          document.getElementById('swal-input1').focus();
        },
      });
  
      if (addressResult.isDismissed && addressResult.dismiss === Swal.DismissReason.close) {
        return null;
      }
      if (!addressResult.value) return null;
  
      const addressInfo = addressResult.value;
      const updatePayload = {
        guestId: guestUser.id,
        phone: guestUser.phone || namePhone.phone,
        address: addressInfo.address,
        city: addressInfo.city,
        postalCode: addressInfo.postalCode,
        country: addressInfo.country,
        area: addressInfo.area,
      };
  
      const updateResponse = await fetch('/api/guest/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });
  
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        const updateErrorResult = await Swal.fire({
          title: 'Error',
          text: errorData.message || 'Failed to update guest information',
          icon: 'error',
          confirmButtonText: 'Try Again',
          showCloseButton: true,
        });
        if (updateErrorResult.isDismissed && updateErrorResult.dismiss === Swal.DismissReason.close) {
          return null;
        }
        throw new Error(errorData.message || 'Failed to update guest info');
      }
  
      const { user: updatedGuest } = await updateResponse.json();
  
      try {
        const whatsappPayload = {
          phone: guestUser.phone || namePhone.phone,
          email: guestUser.email,
          password: password,
        };
        const whatsappResponse = await fetch('/api/guest/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(whatsappPayload),
        });
  
        if (!whatsappResponse.ok) {
          console.error(
            'Failed to send WhatsApp message:',
            await whatsappResponse.json()
          );
        }
      } catch (whatsappError) {
        console.error('WhatsApp error:', whatsappError);
      }
  
      const successResult = await Swal.fire({
        title: 'Profile Created!',
        html: `
          <div class="text-left">
            <p>Your guest profile has been created successfully!</p>
            <p class="mt-4"><strong>Email:</strong> ${guestUser.email}</p>
            <p><strong>Password:</strong> ${password}</p>
            <div class="bg-green-50 p-3 rounded mt-4">
              <p class="text-sm text-green-700">
                <span class="font-semibold">🇵🇰 WhatsApp confirmation sent to ${
                  guestUser.phone || namePhone.phone
                }</span>
              </p>
              <p class="text-xs text-green-600 mt-1">
                Please save these credentials to track your orders later.
              </p>
            </div>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Continue Shopping',
        showCloseButton: true,
      });
  
      if (successResult.isDismissed && successResult.dismiss === Swal.DismissReason.close) {
        return null;
      }
  
      try {
        const loggedInUser = await loginGuestUser(guestUser.email, password);
        setUser(loggedInUser);
        router.push('/');
        return loggedInUser;
      } catch (loginError) {
        console.error('Auto-login failed:', loginError);
        return guestUser;
      }
    } catch (error) {
      console.error('Guest creation error:', error);
      const errorResult = await Swal.fire({
        title: 'Error',
        html: `
          <p>${error.message || 'Failed to create guest profile'}</p>
          <p class="text-sm text-gray-500 mt-2">Please try again with a valid Pakistani number</p>
        `,
        icon: 'error',
        showCloseButton: true,
      });
      if (errorResult.isDismissed && errorResult.dismiss === Swal.DismissReason.close) {
        return null;
      }
      return null;
    }
  };
  
  const addToCart = async (box) => {
    let currentUser = user;
    
    if (!currentUser) {
      const result = await Swal.fire({
        title: 'Not Logged In',
        text: 'You need to login to add items to cart. Do you want to login or continue as guest?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Continue as Guest',
        reverseButtons: true,
        showCloseButton: true
      });
  
      if (result.isConfirmed) {
        router.push('/login');
        return;
      } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
        currentUser = await createGuestUser();
        if (!currentUser) {
          return;
        }
      } else {
        return; // Stop if popup is closed or dismissed without selecting an option
      }
    }
  
    try {
      const response = await fetch('/api/auth/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          boxId: box.id,
          quantity: quantities[box.id] || 1,
          frequency: frequencies[box.id] || box.deliveryfrequency,
          price: box.price
        }),
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to cart');
      }
  
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Added to cart!',
        showConfirmButton: false,
        timer: 1500
      });

      // Optionally redirect to cart page
      // router.push('/cart');
    } catch (error) {
      console.error('Add to cart error:', error);
      Swal.fire('Error', error.message || 'Failed to add item to cart', 'error');
    }
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
                  priority={index < 4}
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
                      value={quantities[box.id] || 1}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(box.id, e.target.value);
                      }}
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
                      value={frequencies[box.id] || box.deliveryfrequency}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleFrequencyChange(box.id, e.target.value);
                      }}
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-Weekly">Bi-Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                <button 
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(box);
                  }}
                >
                  🛒 ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 cursor-pointer text-2xl"
              onClick={() => setSelectedBox(null)}
            >
              ×
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