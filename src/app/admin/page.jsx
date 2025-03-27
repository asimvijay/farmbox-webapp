"use client"

import { useState } from 'react';
import Head from 'next/head';
import Sidebar from '../components/admin/sidebar';
import Header from '../components/admin/header';
import TabContent from '../components/admin/TabContent';

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Head>
        <title>Admin Dashboard | FarmBox</title>
        <meta name="description" content="FarmBox Admin Dashboard" />
      </Head>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      <div className="flex-1 overflow-auto">
        <Header activeTab={activeTab} />
        
        <main className="p-6">
          <TabContent 
            activeTab={activeTab}
            stats={stats}
            recentOrders={recentOrders}
            popularProducts={popularProducts}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;