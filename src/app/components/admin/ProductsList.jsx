"use client"

const ProductsList = ({ popularProducts }) => {
  return (
    <div className="mb-8">
      <h4 className="text-lg font-medium text-gray-700 mb-4">Popular Products</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {popularProducts.map((product, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h5 className="font-medium text-gray-800">{product.name}</h5>
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>Sales: {product.sales}</span>
              <span>Stock: {product.stock}</span>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="text-sm text-green-600 hover:text-green-800">Edit</button>
              <button className="text-sm text-gray-600 hover:text-gray-800">View</button>
              <button className="text-sm text-red-600 hover:text-red-800">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;