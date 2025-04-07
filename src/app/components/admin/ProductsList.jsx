"use client"

import { useEffect, useState } from 'react';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/farmboxes/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="mb-8">
      <h4 className="text-lg font-medium text-gray-700 mb-4">Popular Products</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h5 className="font-medium text-gray-800">{product.name}</h5>
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>Sales: {product.sales}</span>
              <span>Stock: {product.stock}</span>
            </div>
            {/* Rest of the product card */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;