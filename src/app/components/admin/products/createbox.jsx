// File: src/app/components/admin/products/createbox.jsx
"use client"

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Farmbox1 from '@/public/Farmbox1.jpg';

const CreateFarmBox = ({ onBack }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    products: [],
    image: '',
    category: 'Vegetables',
    isFeatured: false,
    deliveryFrequency: 'weekly',
    boxType: 'featured',
    maxQuantity: 0
  });
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [existingBox, setExistingBox] = useState(null);
  const [allFarmBoxes, setAllFarmBoxes] = useState([]);

  const featuredBoxes = [
    { name: "Fruit Box", category: "Fruits", image: Farmbox1.src },
    { name: "Vegetable Box", category: "Vegetables", image: Farmbox1.src },
    { name: "Vegetable and Fruit Box", category: "mixed", image: Farmbox1.src },
    { name: "Mixed Vegetables, Fruits and More Box", category: "mixed", image: Farmbox1.src }
  ];

  // Fetch farmboxes before other data
  useEffect(() => {
    const fetchFarmBoxes = async () => {
      try {
        const boxesResponse = await fetch('/api/farmboxes?nocache=' + Date.now());
        if (!boxesResponse.ok) {
          throw new Error(`Failed to fetch farmboxes: ${boxesResponse.status}`);
        }
        const boxesData = await boxesResponse.json()
        setAllFarmBoxes(Array.isArray(boxesData) ? boxesData : []);
      } catch (boxError) {
        console.error('Error fetching farmboxes:', boxError.message);
        setError('Failed to load farmboxes. Please try again.');
        setAllFarmBoxes([]);
      }
    };
    fetchFarmBoxes();
  }, []);

  // Log allFarmBoxes and availableFeaturedBoxes for debugging
  useEffect(() => {

  }, [allFarmBoxes]);

  // Fetch products after farmboxes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const productsResponse = await fetch('/api/farmboxes/products?nocache=' + Date.now());
        if (!productsResponse.ok) {
          throw new Error(`Failed to fetch products: ${productsResponse.status}`);
        }

        const productsData = await productsResponse.json();
  
        setAllProducts(productsData);

        const filtered = productsData.filter(p => p.category.toLowerCase() === 'vegetables');
  
        setFilteredProducts(filtered);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (allFarmBoxes !== null) {
      fetchProducts();
    }
  }, [allFarmBoxes]);

  // Update image preview
  useEffect(() => {
    setImagePreview(formData.image || '');
  }, [formData.image]);

  // Calculate total price
  const calculateTotalPrice = useCallback((products) => {
    const total = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    return (total + 100).toFixed(2);
  }, []);

  // Calculate maximum box quantity
  const maxBoxQuantity = useMemo(() => {
    if (!formData.products.length || !allProducts.length) return 0;

    const quantities = formData.products.map(product => {
      const stockProduct = allProducts.find(p => p.id === product.productId);
      if (!stockProduct || stockProduct.stock === 0) return 0;
      return Math.floor(stockProduct.stock / product.quantity);
    });

    return Math.min(...quantities);
  }, [formData.products, allProducts]);

  // Update formData.maxQuantity
  useEffect(() => {
    setFormData(prev => ({ ...prev, maxQuantity: maxBoxQuantity }));
  }, [maxBoxQuantity]);

  // Check for existing featured box
  const checkExistingBox = useCallback((boxName) => {
    const existing = allFarmBoxes.find(box => box.name === boxName && box.isfeatured);
    if (existing) {
      setExistingBox(existing);
      return true;
    }
    setExistingBox(null);
    return false;
  }, [allFarmBoxes]);

  // Filter available featured box options
  const availableFeaturedBoxes = useMemo(() => {
    return featuredBoxes.filter(
      box => !allFarmBoxes.some(farmBox => farmBox.name === box.name && farmBox.isfeatured)
    );
  }, [allFarmBoxes]);

  // Filter products and handle featured box logic
  useEffect(() => {
    if (!allProducts.length) return;

    let filtered = [];
    if (formData.boxType === 'featured' && formData.name) {
      const selectedBox = featuredBoxes.find(box => box.name === formData.name);
      if (selectedBox) {
        filtered = selectedBox.category === 'mixed'
          ? allProducts.filter(p => ['Fruits', 'Vegetables'].includes(p.category))
          : allProducts.filter(p => p.category === selectedBox.category);
      

        const boxExists = checkExistingBox(formData.name);

        let selectedProducts = [];
        if (boxExists && existingBox) {
          selectedProducts = existingBox.products.map(boxProduct => {
            const currentProduct = allProducts.find(p => p.id === boxProduct.productId);
            return {
              productId: boxProduct.productId,
              quantity: boxProduct.quantity,
              name: boxProduct.name,
              price: currentProduct?.price || boxProduct.price
            };
          });

          const newProducts = filtered
            .filter(product => 
              product.stock > 0 && 
              !selectedProducts.some(p => p.productId === product.id)
            )
            .map(product => ({
              productId: product.id,
              quantity: 1,
              name: product.name,
              price: product.price
            }));

          selectedProducts = [...selectedProducts, ...newProducts];
        } else {
          selectedProducts = filtered
            .filter(product => product.stock > 0)
            .map(product => ({
              productId: product.id,
              quantity: 1,
              name: product.name,
              price: product.price
            }));
        }

        setFormData(prev => ({
          ...prev,
          products: selectedProducts,
          price: calculateTotalPrice(selectedProducts),
          image: selectedBox.image,
          category: selectedBox.category,
          isFeatured: true,
          description: existingBox?.description || prev.description
        }));
        setImagePreview(selectedBox.image);
      }
    } else {
      filtered = allProducts.filter(p => p.category.toLowerCase() === formData.category.toLowerCase());
   
    }

    setFilteredProducts(filtered);
    setSelectAll(formData.boxType === 'featured' && filtered.length > 0);
  }, [formData.boxType, formData.name, formData.category, allProducts, calculateTotalPrice, existingBox, checkExistingBox]);

  // Handle stock adjustment
  const adjustProductStocks = useCallback(async (boxId, newProducts, oldProducts = []) => {
    try {
      const response = await fetch('/api/farmboxes/adjust-stocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boxId, newProducts, oldProducts })
      });
      
      if (!response.ok) {
        throw new Error('Failed to adjust product stocks');
      }
      return await response.json();
    } catch (error) {
      setError(error.message);
      return null;
    }
  }, []);

  const handleSelectAll = useCallback((e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    setFormData(prev => {
      if (checked) {
        const selectedProducts = filteredProducts
          .filter(p => p.stock > 0)
          .map(p => ({
            productId: p.id,
            quantity: 1,
            name: p.name,
            price: p.price
          }));
        return { ...prev, products: selectedProducts, price: calculateTotalPrice(selectedProducts) };
      }
      return { ...prev, products: [], price: '100.00', maxQuantity: 0 };
    });
  }, [filteredProducts, calculateTotalPrice]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };

      if (name === 'boxType') {
        updated.name = '';
        updated.products = [];
        updated.image = '';
        updated.price = '100.00';
        updated.category = 'Vegetables';
        updated.maxQuantity = 0;
        updated.isFeatured = value === 'featured';
        setExistingBox(null);
      }

      return updated;
    });
  }, []);

  const handleProductToggle = useCallback((productId) => {
    if (formData.boxType === 'featured') return;

    setFormData(prev => {
      const isSelected = prev.products.some(p => p.productId === productId);
      let updatedProducts;

      if (isSelected) {
        updatedProducts = prev.products.filter(p => p.productId !== productId);
      } else {
        const productToAdd = allProducts.find(p => p.id === productId);
        if (!productToAdd) return prev;
        updatedProducts = [
          ...prev.products,
          {
            productId,
            quantity: 1,
            name: productToAdd.name,
            price: productToAdd.price
          }
        ];
      }

      setSelectAll(filteredProducts.every(p => updatedProducts.some(up => up.productId === p.id)));
      return { ...prev, products: updatedProducts, price: calculateTotalPrice(updatedProducts) };
    });
  }, [formData.boxType, allProducts, filteredProducts, calculateTotalPrice]);

  const handleQuantityChange = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) return;

    const product = allProducts.find(p => p.id === productId);
    if (!product || newQuantity > product.stock) {
      setError(`Cannot set quantity above available stock (${product?.stock}kg).`);
      return;
    }

    setFormData(prev => {
      const existingProduct = prev.products.find(p => p.productId === productId);
      let updatedProducts;

      if (existingProduct) {
        updatedProducts = prev.products.map(p =>
          p.productId === productId ? { ...p, quantity: newQuantity } : p
        );
      } else {
        const productToAdd = allProducts.find(p => p.id === productId);
        if (!productToAdd) return prev;
        updatedProducts = [
          ...prev.products,
          {
            productId,
            quantity: newQuantity,
            name: productToAdd.name,
            price: productToAdd.price
          }
        ];
      }

      return { ...prev, products: updatedProducts, price: calculateTotalPrice(updatedProducts) };
    });
  }, [allProducts, calculateTotalPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.products.length) {
        throw new Error('Please select at least one product.');
      }

      if (existingBox) {
        const stockAdjustment = await adjustProductStocks(
          existingBox.id,
          formData.products,
          existingBox.products
        );
        
        if (!stockAdjustment) {
          throw new Error('Failed to adjust product stocks');
        }
      }

      const endpoint = existingBox 
        ? `/api/farmboxes/updatebox?id=${existingBox.id}`
        : '/api/farmboxes/createbox';

      const method = existingBox ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isfeatured: formData.isFeatured })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create/update farmbox.');
      }

      const resultBox = await response.json();
      router.push(`/admin/farmboxes/${resultBox.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !allProducts.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="mb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800"
          aria-label="Go back"
        >
          ← Back
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {existingBox ? `Update ${existingBox.name}` : 'Create New FarmBox'}
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700" role="alert">
          {error}
        </div>
      )}

      {existingBox && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
          <p className="font-medium">You are updating an existing featured box.</p>
          <p className="text-sm mt-1">
            Any changes will update the box inventory. Products not in stock will be automatically removed.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <fieldset>
              <legend className="text-sm text-gray-700">Box Type *</legend>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="boxType"
                    value="featured"
                    checked={formData.boxType === 'featured'}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Box</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="boxType"
                    value="custom"
                    checked={formData.boxType === 'custom'}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">Custom Box</span>
                </label>
              </div>
            </fieldset>

            <label className="block">
              <span className="text-sm text-gray-700">Box Name *</span>
              {formData.boxType === 'featured' ? (
                <div>
                  <select
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    required
                    aria-required="true"
                  >
                    <option value="">Select a featured box</option>
                    {availableFeaturedBoxes.map((box, index) => (
                      <option key={index} value={box.name}>{box.name}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Note: Only available featured boxes are shown. Existing featured boxes are excluded.
                    {availableFeaturedBoxes.length === 0 && (
                      <span className="text-red-500"> All featured boxes are currently in use.</span>
                    )}
                  </p>
                </div>
              ) : (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                  aria-required="true"
                />
              )}
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
                aria-required="true"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Price (Rs.) *</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                className="mt-1 w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-gray-100"
                readOnly
                aria-readonly="true"
              />
              <p className="mt-1 text-sm text-gray-500">Includes 100 Rs packaging fee</p>
            </label>
          </div>

          <div className="space-y-4">
            {formData.boxType === 'custom' && (
              <label className="block">
                <span className="text-sm text-gray-700">Image URL</span>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500 shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </label>
            )}

            {imagePreview && (
              <div className="w-full h-40 relative bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Image preview"
                  className="object-contain w-full h-full"
                  onError={() => setImagePreview('')}
                />
              </div>
            )}

            {formData.boxType === 'custom' && (
              <label className="block">
                <span className="text-sm text-gray-700">Category</span>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500 shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="mixed">Mixed</option>
                  <option value="specialty">Specialty</option>
                </select>
              </label>
            )}

            <label className="block">
              <span className="text-sm text-gray-700">Delivery Frequency</span>
              <select
                name="deliveryFrequency"
                value={formData.deliveryFrequency}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Select Products *</h3>

          {formData.boxType === 'custom' && filteredProducts.length > 0 && (
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="select-all"
                checked={selectAll}
                onChange={handleSelectAll}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                Select 1kg of all available products
              </label>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <p className="text-gray-500">No products available in this category.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => {
                const isSelected = formData.boxType === 'featured' ||
                  formData.products.some(p => p.productId === product.id);
                const selectedProduct = formData.products.find(p => p.productId === product.id);
                const isOutOfStock = product.stock === 0;

                return (
                  <div
                    key={product.id}
                    className={`p-3 border rounded-lg ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <label className="flex items-center gap-2">
                        {formData.boxType === 'custom' && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleProductToggle(product.id)}
                            disabled={isOutOfStock}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            aria-label={`Select ${product.name}`}
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-700">{product.name}</p>
                          <p className="text-sm text-gray-600">Rs. {product.price}/kg</p>
                          <span className="text-sm text-gray-600">
                            {isOutOfStock ? (
                              <span className="text-red-500 font-semibold">Out of stock</span>
                            ) : (
                              `${product.stock}kg in stock`
                            )}
                          </span>
                        </div>
                      </label>
                    </div>

                    {isSelected && (
                      <div className="mt-3 flex items-center">
                        {formData.boxType === 'custom' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product.id, (selectedProduct?.quantity || 1) - 1)}
                              className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
                              disabled={selectedProduct?.quantity <= 1}
                              aria-label={`Decrease quantity of ${product.name}`}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-t border-b border-gray-300 bg-white">
                              {selectedProduct?.quantity || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product.id, (selectedProduct?.quantity || 1) + 1)}
                              className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
                              disabled={isOutOfStock || (selectedProduct?.quantity || 1) >= product.stock}
                              aria-label={`Increase quantity of ${product.name}`}
                            >
                              +
                            </button>
                          </>
                        ) : (
                          <span className="text-sm text-gray-600">Quantity: {selectedProduct?.quantity || 1} kg</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {formData.products.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Box Availability</h4>
            <p className="text-gray-700">
              {maxBoxQuantity > 0
                ? `Maximum Boxes Available: ${maxBoxQuantity} boxes`
                : 'No boxes available due to insufficient stock or no products selected.'}
            </p>
          </div>
        )}

        {formData.products.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Selected Products:</h4>
            <ul className="space-y-2">
              {formData.products.map(product => (
                <li key={product.productId} className="flex justify-between text-gray-600">
                  <span>{product.name} × {product.quantity} kg</span>
                  <span className="font-medium text-gray-600">
                    Rs. {(product.price * product.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
              <li className="flex justify-between text-gray-600 pt-2 border-t">
                <span>Packaging Fee</span>
                <span className="font-medium text-gray-600">Rs. 100.00</span>
              </li>
              <li className="flex justify-between text-gray-700 font-semibold pt-2">
                <span>Total</span>
                <span className='text-gray-600'>Rs. {formData.price}</span>
              </li>
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            aria-label="Cancel and go back"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400"
            aria-label="Create FarmBox"
          >
            {isLoading ? 'Creating...' : 'Create FarmBox'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFarmBox;
