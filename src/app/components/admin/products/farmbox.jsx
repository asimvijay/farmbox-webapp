"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const FarmBoxesManager = () => {
  const [boxes, setBoxes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newBox, setNewBox] = useState({
    name: '',
    description: '',
    price: '',
    products: [],
    image: ''
  });
  const [allProducts, setAllProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [boxesRes, productsRes] = await Promise.all([
          fetch('/api/farmboxes'),
          fetch('/api/products')
        ]);

        if (!boxesRes.ok || !productsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [boxesData, productsData] = await Promise.all([
          boxesRes.json(),
          productsRes.json()
        ]);

        setBoxes(boxesData);
        setAllProducts(productsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateBox = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/farmboxes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBox),
      });

      if (!response.ok) {
        throw new Error('Failed to create box');
      }

      const createdBox = await response.json();
      setBoxes([...boxes, createdBox]);
      setIsCreating(false);
      setNewBox({
        name: '',
        description: '',
        price: '',
        products: [],
        image: ''
      });
    } catch (err) {
      console.error('Error creating box:', err);
      setError(err.message);
    }
  };

  const handleDeleteBox = async (id) => {
    try {
      const response = await fetch(`/api/farmboxes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete box');
      }

      setBoxes(boxes.filter(box => box._id !== id));
    } catch (err) {
      console.error('Error deleting box:', err);
      setError(err.message);
    }
  };

  const handleProductToggle = (productId) => {
    setNewBox(prev => {
      const isSelected = prev.products.includes(productId);
      return {
        ...prev,
        products: isSelected
          ? prev.products.filter(id => id !== productId)
          : [...prev.products, productId]
      };
    });
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Farm Boxes Management</h3>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Create New Box
        </button>
      </div>

      {isCreating && (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Create New Farm Box</h4>
          <form onSubmit={handleCreateBox}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Box Name</label>
                <input
                  type="text"
                  value={newBox.name}
                  onChange={(e) => setNewBox({...newBox, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                <input
                  type="number"
                  value={newBox.price}
                  onChange={(e) => setNewBox({...newBox, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newBox.description}
                  onChange={(e) => setNewBox({...newBox, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  rows={3}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newBox.image}
                  onChange={(e) => setNewBox({...newBox, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Products</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allProducts.map(product => (
                    <div key={product._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`product-${product._id}`}
                        checked={newBox.products.includes(product._id)}
                        onChange={() => handleProductToggle(product._id)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`product-${product._id}`} className="ml-2 text-sm text-gray-700">
                        {product.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create Box
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boxes.map(box => (
          <div key={box._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {box.image && (
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img 
                  src={box.image} 
                  alt={box.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-800">{box.name}</h3>
                <span className="text-lg font-semibold text-green-600">Rs. {box.price}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{box.description}</p>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {box.products.slice(0, 3).map(productId => {
                    const product = allProducts.find(p => p._id === productId);
                    return product ? <li key={productId}>• {product.name}</li> : null;
                  })}
                  {box.products.length > 3 && (
                    <li className="text-green-600">+ {box.products.length - 3} more</li>
                  )}
                </ul>
              </div>

              <div className="mt-6 flex space-x-2">
                <button 
                  onClick={() => router.push(`/admin/farmboxes/${box._id}`)}
                  className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded text-sm font-medium"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteBox(box._id)}
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmBoxesManager;