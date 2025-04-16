
"use client"

import { useState, useEffect } from 'react';
import Farmbox1 from '@/public/Farmbox1.jpg';
import EditableFarmBox from './editbox';

const FarmBoxesManager = () => {
  const [farmboxes, setFarmboxes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBoxId, setEditingBoxId] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch farmboxes
        const farmboxesResponse = await fetch('/api/farmboxes');
        if (!farmboxesResponse.ok) throw new Error('Failed to fetch farmboxes');
        const farmboxesData = await farmboxesResponse.json();
        const parsedFarmboxes = farmboxesData.map(box => ({
          ...box,
          products: JSON.parse(box.products)
        }));
        setFarmboxes(parsedFarmboxes);

        // Fetch available products
        const productsResponse = await fetch('/api/farmboxes/products');
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        setAvailableProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (boxId) => {
    setEditingBoxId(boxId);
  };

  const handleCancelEdit = () => {
    setEditingBoxId(null);
  };

  const handleSaveEdit = async (boxId, updatedBox) => {
    try {
      const originalBox = farmboxes.find(box => box.id === boxId);
      const quantityDiff = originalBox.maxQuantity - updatedBox.maxQuantity;

      if (quantityDiff > 0) {
        // Return stock to products
        for (const product of originalBox.products) {
          await fetch('/api/products/update-stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: product.id,
              quantity: product.quantity * quantityDiff
            })
          });
        }
      }

      const response = await fetch(`/api/farmboxes/update?id=${boxId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedBox,
          products: updatedBox.products
        })
      });

      if (!response.ok) throw new Error('Failed to update farmbox');

      const updatedData = await response.json();
      setFarmboxes(prev => prev.map(box => 
        box.id === boxId ? { ...updatedData, products: JSON.parse(updatedData.products) } : box
      ));
      setEditingBoxId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (boxId) => {
    if (!confirm('Are you sure you want to delete this farm box?')) return;
    
    try {
      const response = await fetch('/api/farmboxes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: boxId }),
      });

      if (!response.ok) throw new Error('Delete failed');
      
      setFarmboxes(prev => prev.filter(box => box.id !== boxId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mx-4">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">Manage Farm Boxes</h3>
        <div className="flex gap-2">
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            {farmboxes.length} Available Boxes
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {farmboxes.length > 0 ? (
          farmboxes.map((box) => (
            <div 
              key={box.id} 
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
            >
              <>
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <button 
                    onClick={() => handleEdit(box.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm cursor-pointer rounded-lg shadow-sm hover:bg-green-50 transition-colors duration-200"
                    aria-label="Edit farm box"
                  >
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(box.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg cursor-pointer shadow-sm hover:bg-red-50 transition-colors duration-200"
                    aria-label="Delete farm box"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Featured Badge */}
                {box.isfeatured && (
                  <div 
                    className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 transition-transform duration-200 group-hover:scale-105 z-10"
                    aria-label="Featured box"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Featured
                  </div>
                )}

                {/* Custom Box Badge */}
                {!box.isfeatured && (
                  <div 
                    className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 transition-transform duration-200 group-hover:scale-105 z-10"
                    aria-label="Custom box"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Custom Box
                  </div>
                )}

                {/* Image Section */}
                {box.image && (
                  <div className="h-56 overflow-hidden">
                    <img 
                      src={Farmbox1.src} 
                      alt={box.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold text-gray-800 truncate">{box.name}</h4>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-sm font-semibold">
                      ${parseFloat(box.price).toFixed(2)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{box.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2 2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                      </svg>
                      {box.deliveryfrequency}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                      </svg>
                      Max {box.maxquantity}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Includes:</h5>
                    <div className="h-[12vh] overflow-y-scroll scrollbar-hide">
                      {box.products.map((product, index) => (
                        <div key={index} className="flex justify-between items-center text-sm py-1">
                          <span className="text-gray-600">{product.name}</span>
                          <span className="text-green-600 font-medium">{product.quantity}kg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h4 className="mt-4 text-lg font-medium text-gray-900">No farmboxes available</h4>
              <p className="mt-1 text-sm text-gray-500">Create your first farmbox to get started.</p>
            </div>
          </div>
        )}
      </div>

      {editingBoxId && (
        <EditableFarmBox
          box={farmboxes.find(box => box.id === editingBoxId)}
          availableProducts={availableProducts}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default FarmBoxesManager;
