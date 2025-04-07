"use client"

import { useEffect, useState } from 'react';
import StatsCards from './statscard';
import Charts from './chart';
import RecentOrders from './RecentOrders';
import ProductsList from './ProductsList';
import CustomersList from './customers';

const TabContent = ({ activeTab }) => {
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    recentOrders: [],
    popularProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all dashboard data at once
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          fetch('/api/farmboxes/stats'),
          fetch('/api/farmboxes/orders'),
          fetch('/api/farmboxes/products')
        ]);

        if (!statsRes.ok || !ordersRes.ok || !productsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [stats, recentOrders, popularProducts] = await Promise.all([
          statsRes.json(),
          ordersRes.json(),
          productsRes.json()
        ]);

        setDashboardData({ stats, recentOrders, popularProducts });
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  if (loading && activeTab === 'dashboard') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error && activeTab === 'dashboard') {
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

  switch (activeTab) {
    case 'dashboard':
      return (
        <>
          <StatsCards stats={dashboardData.stats} />
          <Charts orders={dashboardData.recentOrders} products={dashboardData.popularProducts} />
          <RecentOrders orders={dashboardData.recentOrders} />
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
          <ProductsList />
        </div>
      );
    case 'orders':
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Orders Management</h3>
          <RecentOrders showAll={true} />
        </div>
      );
    case 'customers':
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Customers Management</h3>
          <CustomersList />
        </div>
      );
    case 'deliveries':
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Delivery Management</h3>
          <RecentOrders statusFilter="In Transit" />
        </div>
      );
    case 'reports':
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Reports & Analytics</h3>
          <Charts showAll={true} />
        </div>
      );
    default:
      return null;
  }
};

export default TabContent;