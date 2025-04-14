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
    image: '',
    category: '',
    isFeatured: false,
    deliveryFrequency: '',
    boxType: 'regular',
    maxQuantity: 0
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



  const handleProductToggle = (product) => {
    setNewBox(prev => {
      const existingProduct = prev.products.find(p => p.productId === product._id);
      if (existingProduct) {
        return {
          ...prev,
          products: prev.products.filter(p => p.productId !== product._id)
        };
      }
      return {
        ...prev,
        products: [...prev.products, {
          productId: product._id,
          name: product.name,
          quantity: 1
        }]
      };
    });
  };

  const handleQuantityChange = (productId, value) => {
    setNewBox(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.productId === productId ? { ...p, quantity: Math.max(1, Number(value)) } : p
      )
    }));
  };

  // Rest of the loading and error states remain the same...

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* ... existing header and create button ... */}

      {isCreating && (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Create New Farm Box</h4>
          <form onSubmit={handleCreateBox}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* ... existing name, price, description, image fields ... */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newBox.category}
                  onChange={(e) => setNewBox({...newBox, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Frequency</label>
                <select
                  value={newBox.deliveryFrequency}
                  onChange={(e) => setNewBox({...newBox, deliveryFrequency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Frequency</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Box Type</label>
                <select
                  value={newBox.boxType}
                  onChange={(e) => setNewBox({...newBox, boxType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="regular">Regular</option>
                  <option value="featured">Featured</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={newBox.maxQuantity}
                  onChange={(e) => setNewBox({...newBox, maxQuantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newBox.isFeatured}
                  onChange={(e) => setNewBox({...newBox, isFeatured: e.target.checked})}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Featured Box</label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Products</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allProducts.map(product => (
                    <div key={product._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`product-${product._id}`}
                        checked={newBox.products.some(p => p.productId === product._id)}
                        onChange={() => handleProductToggle(product)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`product-${product._id}`} className="ml-2 text-sm text-gray-700">
                        {product.name}
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 space-y-2">
                  {newBox.products.map(product => (
                    <div key={product.productId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{product.name}</span>
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
                        className="w-20 px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* ... existing form buttons ... */}
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boxes.map(box => (
          <div key={box.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {/* ... existing image and header ... */}
            <div className="p-4">
              {/* ... existing name and price ... */}
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="font-medium">Category:</span> {box.category}</p>
                <p><span className="font-medium">Delivery:</span> {box.deliveryFrequency}</p>
                <p><span className="font-medium">Type:</span> {box.boxType}</p>
                <p><span className="font-medium">Max Qty:</span> {box.maxQuantity}</p>
                {box.isFeatured && <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Featured</span>}
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {box.products.slice(0, 3).map((product, index) => (
                    <li key={index}>• {product.name} ({product.quantity}kg)</li>
                  ))}
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