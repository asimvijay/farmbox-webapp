"use client";

import { useState } from 'react';

const CreateProduct = ({ onBack }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [priceRs, setPriceRs] = useState('');
  const [stockKg, setStockKg] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      name,
      category,
      price: parseInt(priceRs),
      stock: parseInt(stockKg),
      image,
    };

    try {
      const res = await fetch('/api/farmboxes/createprod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (res.ok) {
        alert('Product created successfully!');
        onBack();
      } else {
        alert('Failed to create product.');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('An error occurred.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-xl mx-auto">
      <div className="mb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800"
        >
          ← Back
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Leafy Greens">Leafy Greens</option>
            <option value="Dairy">Dairy</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price (Rs/kg)</label>
          <input
            type="number"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            value={priceRs}
            onChange={(e) => setPriceRs(e.target.value)}
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700">Stock (kg)</label>
          <input
            type="number"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            value={stockKg}
            onChange={(e) => setStockKg(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
