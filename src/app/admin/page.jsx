"use client"

import { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sample data
  const stats = [
    { title: "Today's Orders", value: 42, change: "+12%", trend: 'up' },
    { title: "Revenue", value: "Rs. 124,500", change: "+8%", trend: 'up' },
    { title: "New Customers", value: 18, change: "+5%", trend: 'up' },
    { title: "Pending Deliveries", value: 7, change: "-2%", trend: 'down' }
  ];

  const recentOrders = [
    { id: "#FB-1001", customer: "Ali Khan", amount: "Rs. 2,500", status: "Delivered", date: "Today, 10:30 AM" },
    { id: "#FB-1002", customer: "Fatima Ahmed", amount: "Rs. 3,200", status: "In Transit", date: "Today, 09:15 AM" },
    { id: "#FB-1003", customer: "Usman Siddiqui", amount: "Rs. 1,800", status: "Processing", date: "Today, 08:45 AM" },
    { id: "#FB-1004", customer: "Ayesha Malik", amount: "Rs. 4,500", status: "Pending", date: "Yesterday, 05:30 PM" },
    { id: "#FB-1005", customer: "Bilal Hassan", amount: "Rs. 2,100", status: "Delivered", date: "Yesterday, 03:15 PM" }
  ];

  const popularProducts = [
    { name: "Organic Tomatoes", sales: 124, stock: 56 },
    { name: "Fresh Spinach", sales: 98, stock: 34 },
    { name: "Free-range Eggs", sales: 87, stock: 42 },
    { name: "Organic Potatoes", sales: 76, stock: 89 },
    { name: "Seasonal Fruits", sales: 65, stock: 23 }
  ];

  // Chart data and options
  const weeklySalesOptions = {
    chart: {
      type: 'area',
      height: 350,
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    colors: ['#10B981'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      }
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "Rs. " + val
        }
      }
    }
  };

  const weeklySalesSeries = [{
    name: 'Sales',
    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000]
  }];

  const orderStatusOptions = {
    chart: {
      type: 'donut',
    },
    colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
    labels: ['Delivered', 'In Transit', 'Processing', 'Pending'],
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const orderStatusSeries = [35, 15, 10, 5];

  return (
    <div className="flex h-screen bg-gray-50">
      <Head>
        <title>Admin Dashboard | FarmBox</title>
        <meta name="description" content="FarmBox Admin Dashboard" />
      </Head>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-green-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-green-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">FarmBox Admin</h1>
          ) : (
            <h1 className="text-xl font-bold">FB</h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-green-700"
          >
            {sidebarOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-green-700' : 'hover:bg-green-700'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'orders' ? 'bg-green-700' : 'hover:bg-green-700'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {sidebarOpen && <span>Orders</span>}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'products' ? 'bg-green-700' : 'hover:bg-green-700'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {sidebarOpen && <span>Products</span>}
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'customers' ? 'bg-green-700' : 'hover:bg-green-700'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {sidebarOpen && <span>Customers</span>}
          </button>

          <button
            onClick={() => setActiveTab('deliveries')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'deliveries' ? 'bg-green-700' : 'hover:bg-green-700'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-4.447-2.724A1 1 0 014 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {sidebarOpen && <span>Deliveries</span>}
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'reports' ? 'bg-green-700' : 'hover:bg-green-700'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {sidebarOpen && <span>Reports</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-green-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-green-200">admin@farmbox.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                    <div className="mt-2 flex justify-between items-end">
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-800 font-medium mb-4">Weekly Sales</h3>
                  <Chart
                    options={weeklySalesOptions}
                    series={weeklySalesSeries}
                    type="area"
                    height={350}
                  />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-800 font-medium mb-4">Order Status</h3>
                  <Chart
                    options={orderStatusOptions}
                    series={orderStatusSeries}
                    type="donut"
                    height={350}
                  />
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-gray-800 font-medium">Recent Orders</h3>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.map((order, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-green-600 hover:text-green-900 mr-3">View</button>
                            <button className="text-gray-600 hover:text-gray-900">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Orders Management</h3>
              <p className="text-gray-600">Order management content goes here...</p>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Products Management</h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                  Add New Product
                </button>
              </div>

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
            </div>
          )}

          {/* Other tabs would follow the same pattern */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Customers Management</h3>
              <p className="text-gray-600">Customer management content goes here...</p>
            </div>
          )}

          {activeTab === 'deliveries' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Delivery Management</h3>
              <p className="text-gray-600">Delivery management content goes here...</p>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Reports & Analytics</h3>
              <p className="text-gray-600">Reports content goes here...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;