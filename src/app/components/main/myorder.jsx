"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const MyOrders = ({ orders, onClose }) => {
  const router = useRouter();
  const popupRef = useRef(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Close popup when clicking outside
  useEffect(() => {
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'in transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div 
        ref={popupRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in"
      >
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-lg font-medium text-gray-900">My Orders</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="px-6 py-4">
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order,index) => (
                <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="font-medium text-gray-900">Order {index + 1}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-gray-600">{formatDate(order.date)}</div>
                      <div className="font-medium">${order.amount.toFixed(2)}</div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-800 mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                                  <Image 
                                    src="/product-placeholder.png" 
                                    alt={item.product_name}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{item.product_name}</div>
                                  <div className="text-sm text-gray-500">SKU: {item.product_id}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">${item.price.toFixed(2)}</div>
                                <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500">No items found</div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">Order Total:</div>
                          <div className="font-bold text-lg">${order.amount.toFixed(2)}</div>
                        </div>
                        {order.status.toLowerCase() === 'delivered' && (
                          <button className="mt-3 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            Track Package
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="mt-1 text-gray-500">You haven't placed any orders yet.</p>
              <div className="mt-6">
                <Link href="/products">
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

export default MyOrders;