import { useState } from 'react';

const EditableFarmBox = ({ box, availableProducts, onSave, onCancel }) => {
  const [editedBox, setEditedBox] = useState({
    ...box,
    products: [...box.products]
  });

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...editedBox.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setEditedBox({ ...editedBox, products: updatedProducts });
  };

  const addProduct = (product) => {
    setEditedBox({
      ...editedBox,
      products: [...editedBox.products, { ...product, quantity: 1 }]
    });
  };

  const removeProduct = (index) => {
    const updatedProducts = editedBox.products.filter((_, i) => i !== index);
    setEditedBox({ ...editedBox, products: updatedProducts });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Edit Farm Box
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Box Name</label>
              <input
                type="text"
                value={editedBox.name}
                onChange={(e) => setEditedBox({ ...editedBox, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={editedBox.description}
                onChange={(e) => setEditedBox({ ...editedBox, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Frequency</label>
              <input
                type="text"
                value={editedBox.deliveryfrequency}
                onChange={(e) => setEditedBox({ ...editedBox, deliveryfrequency: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <input
                    type="number"
                    step="0.01"
                    value={editedBox.price}
                    onChange={(e) => setEditedBox({ ...editedBox, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Quantity</label>
                <input
                    type="number"
                    value={editedBox.maxquantity}
                    onChange={(e) => setEditedBox({ ...editedBox, maxquantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
                </div>
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={editedBox.category}
                onChange={(e) => setEditedBox({ ...editedBox, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            <div className="border-t pt-4">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">Box Contents</h5>
              {editedBox.products.map((product, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-3 bg-gray-50 p-3 rounded-lg">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-green-500"
                    placeholder="Product name"
                  />
                  <div className="relative w-full sm:w-24">
                    <input
                      type="number"
                      step="0.1"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', parseFloat(e.target.value))}
                      className="w-full px-3 py-1.5 pr-7 rounded-md border border-gray-200 focus:ring-2 focus:ring-green-500"
                      placeholder="Qty"
                    />
                    <span className="absolute right-2 top-2.5 text-gray-400 text-sm">kg</span>
                  </div>
                  <button
                    onClick={() => removeProduct(index)}
                    className="self-end sm:self-center p-1.5 hover:bg-red-50 rounded-full text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              <select
                onChange={(e) => {
                  const selectedProduct = availableProducts.find(p => p.id === parseInt(e.target.value));
                  if (selectedProduct && !editedBox.products.some(p => p.id === selectedProduct.id)) {
                    addProduct({ ...selectedProduct, quantity: 1 });
                  }
                }}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-300 bg-white text-gray-500 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              >
                <option value="">+ Add Product</option>
                {availableProducts
                  .filter(p => !editedBox.products.some(ep => ep.id === p.id))
                  .map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(box.id, editedBox)}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableFarmBox;