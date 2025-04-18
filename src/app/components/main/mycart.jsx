"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Farmbox1 from "@/public/Farmbox1.jpg";
import { updateCartItemQuantity, placeOrder } from "@/hooks/cart";
import Swal from 'sweetalert2';

const MyCart = ({ cart, onClose }) => {
  const router = useRouter();
  const popupRef = useRef(null);
  const [cartItems, setCartItems] = useState(cart.items || []);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log('MyCart cart prop:', cart); // Debug cart structure
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    setCartItems(cart.items || []);
  }, [cart.items]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (!cart.customer_id) {
      Swal.fire('Error', 'Invalid cart: Customer ID is missing', 'error');
      return;
    }
    if (!itemId) {
      Swal.fire('Error', 'Invalid cart item: Item ID is missing', 'error');
      return;
    }
    if (newQuantity < 1) {
      Swal.fire('Error', 'Quantity must be at least 1', 'error');
      return;
    }

    console.log('Updating quantity:', { customerId: cart.customer_id, itemId, newQuantity });

    try {
      const updatedCart = await updateCartItemQuantity(cart.customer_id, itemId, newQuantity);
      setCartItems(updatedCart.items);

      // Dispatch cartUpdated event to refresh Navbar
      const cartUpdateEvent = new CustomEvent('cartUpdated', {
        detail: { userId: cart.customer_id },
      });
      window.dispatchEvent(cartUpdateEvent);
    } catch (error) {
      console.error('Quantity change error:', error);
      Swal.fire('Error', error.message || 'Failed to update quantity', 'error');
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0)
      .toFixed(2);
  };

  const handlePlaceOrder = async () => {
    if (!cart.customer_id) {
      Swal.fire('Error', 'Invalid cart: Customer ID is missing', 'error');
      return;
    }

    setIsPlacingOrder(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      await placeOrder(cart.customer_id, cartItems, calculateTotal());
      
      // Complete the progress
      clearInterval(progressInterval);
      setProgress(100);

      // Dispatch cartUpdated event to refresh Navbar
      const cartUpdateEvent = new CustomEvent('cartUpdated', {
        detail: { userId: cart.customer_id },
      });
      window.dispatchEvent(cartUpdateEvent);

      // Show success message after a small delay
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Your order has been successfully placed.',
          confirmButtonColor: '#22c55e',
        }).then(() => {
          setIsPlacingOrder(false);
          onClose();
        });
      }, 500);
    } catch (error) {
      console.error('Place order error:', error);
      setIsPlacingOrder(false);
      Swal.fire('Error', error.message || 'Failed to place order', 'error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Loading Overlay */}
      {isPlacingOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center">
            <div className="relative h-4 bg-gray-200 rounded-full mb-4 overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {progress < 100 ? 'Processing Your Order...' : 'Order Completed!'}
            </h3>
            <p className="text-gray-600">
              {progress < 100 
                ? 'Please wait while we process your order' 
                : 'Your order has been successfully placed'}
            </p>
            <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
          </div>
        </div>
      )}

      <div 
        ref={popupRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in"
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-lg font-medium text-gray-900">My Cart</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={isPlacingOrder}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          {cartItems && cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-200 py-3">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <Image 
                        src={Farmbox1.src}
                        alt={item.product.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">{item.product.name}</div>
                      <div className="text-sm text-gray-500">ID: {item.product.id}</div>
                      {item.frequency && (
                        <div className="text-sm text-gray-500">Frequency: {item.frequency}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isPlacingOrder}
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-gray-500">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isPlacingOrder}
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Rs.{parseFloat(item.price).toFixed(2)}</div>
                      <div className="text-sm font-medium text-gray-600">
                        Subtotal: Rs.{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))} 
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-medium text-gray-500 text-lg">Total:</div>
                  <div className="font-bold text-gray-400 text-xl">Rs.{calculateTotal()}</div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isPlacingOrder ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
                  >
                    {isPlacingOrder ? 'Processing...' : 'Place Order'}
                  </button>
                  <Link href="/farmboxes">
                    <button
                      onClick={onClose}
                      disabled={isPlacingOrder}
                      className={`w-full py-3 px-4 border ${
                        isPlacingOrder ? 'border-gray-200' : 'border-gray-300 hover:bg-gray-50'
                      } rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
                    >
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-1 text-gray-500">Add some items to your cart to get started.</p>
              <div className="mt-6">
                <Link href="/farmboxes">
                  <button
                    onClick={onClose}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Browse Products
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCart;