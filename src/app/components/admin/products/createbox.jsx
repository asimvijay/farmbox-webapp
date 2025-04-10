"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const CreateFarmBox = ({ onBack }) => {

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    products: [],
    image: '',
    category: 'vegetables',
    isFeatured: false,
    deliveryFrequency: 'weekly'
  });
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/farmboxes/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setAllProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    }
  }, [formData.image]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProductToggle = (productId) => {
    setFormData(prev => {
      const isSelected = prev.products.includes(productId);
      return {
        ...prev,
        products: isSelected
          ? prev.products.filter(id => id !== productId)
          : [...prev.products, productId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (formData.products.length === 0) {
        throw new Error('Please select at least one product');
      }

      const response = await fetch('/api/farmboxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create farmbox');
      }

      const createdBox = await response.json();
      router.push(`/admin/farmboxes/${createdBox._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && allProducts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 bg-white rounded-xl shadow-sm border border-gray-100">
      
      {/* Back Button */}
      <div className="mb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800"
          >
            ← Back
          </button>
        </div>


      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New FarmBox</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-700">Box Name *</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Description *</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Price (Rs.) *</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </label>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-700">Image URL</span>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
              {imagePreview && (
                <div className="mt-2 w-full h-40 relative bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                    onError={() => setImagePreview('')}
                  />
                </div>
              )}
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Category</span>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              >
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="mixed">Mixed</option>
                <option value="specialty">Specialty</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Delivery Frequency</span>
              <select
                name="deliveryFrequency"
                value={formData.deliveryFrequency}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Featured Box</label>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Select Products *</h3>
          {allProducts.length === 0 ? (
            <p className="text-gray-500">No products available</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {allProducts.map(product => (
                <div key={product._id} className="flex flex-col gap-2">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={formData.products.includes(product._id)}
                      onChange={() => handleProductToggle(product._id)}
                      className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">{product.name}</p>
                      {product.image && (
                        <div className="mt-1 w-full h-20 relative bg-gray-100 rounded-md overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit & Cancel */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Creating...' : 'Create FarmBox'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFarmBox;
