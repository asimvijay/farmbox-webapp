"use client";

import { useEffect, useState } from "react";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import EditProductForm from "./editproduct";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/farmboxes/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setExpandedProductId(productId);
  };

  const handleCloseEditForm = () => {
    setExpandedProductId(null);
  };

  const handleSaveProduct = async (updatedProduct) => {
    try {
      const response = await fetch(`/api/farmboxes/editprod`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct), // Send the whole product as body
      });
  
      if (!response.ok) throw new Error("Failed to update product");
  
      setProducts(products.map(p =>
        p.id === updatedProduct.id ? updatedProduct : p
      ));
      setExpandedProductId(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h4 className="text-lg font-medium text-gray-700 mb-4">Popular Products</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const inStock = product.stock > 0;
          const isExpanded = expandedProductId === product.id;

          return (
            <div
              key={product.id}
              className="relative border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow min-h-[180px]"
            >
              {/* Product Card Content */}
              <div className={`${isExpanded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
                <button
                  onClick={() => handleEdit(product.id)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-green-600 z-10"
                  title="Edit Product"
                >
                  <FaPencilAlt size={18} />
                </button>

                <h5 className="font-medium text-gray-800">{product.name}</h5>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>

                <div className="mt-2 flex justify-between text-sm text-gray-600">
                  <span>Stock: {product.stock}kg </span>
                  <span>Price: Rs {product.price}/kg</span>
                </div>

                <div className="mt-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  {product.isOrganic && (
                    <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
                      Organic
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Form Overlay */}
              {isExpanded && (
               <div className="absolute inset-0 bg-white rounded-lg p-4 z-20 shadow-xl border border-gray-200 min-h-[calc(100%+20px)] -top-2.5 -bottom-2.5">

                  {/* Floating background effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div className="absolute -inset-1 bg-gradient-to-br from-green-50 to-white opacity-70"></div>
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                  </div>
                  
                  {/* Close button */}
                  <button
                    onClick={handleCloseEditForm}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600 z-30"
                    title="Close"
                  >
                    <FaTimes size={18} />
                  </button>
                  
                  {/* Form content with boundary */}
                  <div className="relative z-10 h-full">
                    <div className="h-full flex flex-col">
                      <h5 className="text-lg font-medium text-gray-800 mb-3">Edit {selectedProduct?.name}</h5>
                      <div className="flex-1 overflow-y-auto pr-2">
                        <EditProductForm
                          product={selectedProduct}
                          onClose={handleCloseEditForm}
                          onSave={handleSaveProduct}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsList;