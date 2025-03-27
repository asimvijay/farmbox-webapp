"use client"

import StatsCards from './statscard';
import Charts from './chart';
import RecentOrders from './RecentOrders';
import ProductsList from './ProductsList';

const TabContent = ({ activeTab, stats, recentOrders, popularProducts }) => {
  switch (activeTab) {
    case 'dashboard':
      return (
        <>
          <StatsCards stats={stats} />
          <Charts />
          <RecentOrders recentOrders={recentOrders} />
        </>
      );
    case 'products':
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Products Management</h3>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              Add New Product
            </button>
          </div>
          <ProductsList popularProducts={popularProducts} />
        </div>
      );
    case 'orders':
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Orders Management</h3>
          <p className="text-gray-600">Order management content goes here...</p>
        </div>
      );
    case 'customers':
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Customers Management</h3>
          <p className="text-gray-600">Customer management content goes here...</p>
        </div>
      );
    case 'deliveries':
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Delivery Management</h3>
          <p className="text-gray-600">Delivery management content goes here...</p>
        </div>
      );
    case 'reports':
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Reports & Analytics</h3>
          <p className="text-gray-600">Reports content goes here...</p>
        </div>
      );
    default:
      return null;
  }
};

export default TabContent;